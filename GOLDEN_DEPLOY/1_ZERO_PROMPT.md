Poniżej zwięzły plan organizacji bazy w Supabase (PostgreSQL) dla e-Operatora, z tabelami, kluczami obcymi i przykładowymi politykami RLS (Row Level Security). Całość w języku SQL.

---

## 1. Tabele i relacje

1. **users** (wszyscy użytkownicy)

   ```sql
   CREATE TABLE users (
     id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
     email         TEXT        NOT NULL UNIQUE,
     password_hash TEXT        NOT NULL,
     role          TEXT        NOT NULL CHECK (role IN ('beneficiary','contractor','auditor','operator','admin')),
     name          TEXT        NOT NULL,
     phone_number  TEXT,
     postal_code   TEXT,
     city          TEXT,
     address       TEXT,
     created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );
   ```

2. **service\_requests** (zapytania o zlecenie od beneficjenta)

   ```sql
   CREATE TABLE service_requests (
     id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
     beneficiary_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     postal_code          TEXT        NOT NULL,
     city                 TEXT        NOT NULL,
     street_address       TEXT        NOT NULL,
     phone_number         TEXT        NOT NULL,
     heat_source          TEXT        CHECK (heat_source IN ('pompa_ciepla','piec_pellet','piec_zgazowujacy')),
     windows_count        INTEGER     CHECK (windows_count >= 0),
     doors_count          INTEGER     CHECK (doors_count >= 0),
     wall_insulation_m2   INTEGER     CHECK (wall_insulation_m2 >= 0),
     attic_insulation_m2  INTEGER     CHECK (attic_insulation_m2 >= 0),
     audit_file_url       TEXT,  -- link do audytu bez danych wrażliwych
     status               TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','verified','rejected')),
     created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );
   ```

3. **audit\_requests** (zapytania o audyt od beneficjenta)

   ```sql
   CREATE TABLE audit_requests (
     id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
     beneficiary_id UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     postal_code    TEXT        NOT NULL,
     city           TEXT        NOT NULL,
     street_address TEXT        NOT NULL,
     phone_number   TEXT        NOT NULL,
     status         TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','verified','rejected')),
     created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );
   ```

4. **contractor\_portfolios** (portfolio wykonawcy)

   ```sql
   CREATE TABLE contractor_portfolios (
     id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
     contractor_id   UUID        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
     company_name    TEXT        NOT NULL,
     nip             TEXT        NOT NULL,
     company_address TEXT        NOT NULL,
     description     TEXT,
     created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );
   ```

5. **contractor\_gallery** (zdjęcia w portfolio wykonawcy)

   ```sql
   CREATE TABLE contractor_gallery (
     id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
     portfolio_id  UUID        NOT NULL REFERENCES contractor_portfolios(id) ON DELETE CASCADE,
     image_url     TEXT        NOT NULL,
     caption       TEXT,
     created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );
   ```

6. **auditor\_portfolios** (portfolio audytora)

   ```sql
   CREATE TABLE auditor_portfolios (
     id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
     auditor_id      UUID        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
     name_or_company TEXT        NOT NULL,
     certificate_data TEXT       , -- np. link/skan certyfikatu
     description     TEXT,
     created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );
   ```

7. **contractor\_offers** (oferty wykonawców na service\_requests)

   ```sql
   CREATE TABLE contractor_offers (
     id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
     request_id     UUID        NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
     contractor_id  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     price          NUMERIC(12,2) NOT NULL,
     scope          TEXT        NOT NULL,  -- opis zakresu
     status         TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')),
     created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     UNIQUE(request_id, contractor_id)
   );
   ```

8. **auditor\_offers** (oferty audytorów na audit\_requests)

   ```sql
   CREATE TABLE auditor_offers (
     id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
     request_id     UUID        NOT NULL REFERENCES audit_requests(id) ON DELETE CASCADE,
     auditor_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     price          NUMERIC(12,2) NOT NULL,
     duration_days  INTEGER     NOT NULL,
     status         TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')),
     created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     UNIQUE(request_id, auditor_id)
   );
   ```

9. **opinions** (opinie od beneficjenta po zakończonej usłudze)

   ```sql
   CREATE TABLE opinions (
     id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
     beneficiary_id UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     target_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- wykonawca lub audytor
     rating         INTEGER     NOT NULL CHECK (rating BETWEEN 1 AND 5),
     comment        TEXT,
     created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );
   ```

10. **user\_points** (saldo punktów)

    ```sql
    CREATE TABLE user_points (
      id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      balance    INTEGER     NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    ```

11. **points\_transactions** (historia transakcji punktowych)

    ```sql
    CREATE TABLE points_transactions (
      id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      change     INTEGER     NOT NULL,  -- dodatnie lub ujemne
      reason     TEXT        NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    ```

12. **moderation\_logs** (działania operatora: weryfikacje/odrzucenia)

    ```sql
    CREATE TABLE moderation_logs (
      id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      operator_id  UUID        NOT NULL REFERENCES users(id) ON DELETE SET NULL,
      target_table TEXT        NOT NULL CHECK (target_table IN 
                        ('service_requests','audit_requests','contractor_offers','auditor_offers')),
      target_id    UUID        NOT NULL,
      action       TEXT        NOT NULL,  -- np. 'verified','rejected','deleted'
      reason       TEXT,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    ```

13. **reports** (raporty/statystyki generowane przez operatora)

    ```sql
    CREATE TABLE reports (
      id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      operator_id  UUID        NOT NULL REFERENCES users(id) ON DELETE SET NULL,
      title        TEXT        NOT NULL,
      payload      JSONB       NOT NULL, -- dane raportu/statystyki
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    ```

14. **efficiency\_audits** (przechowywanie plików audytu efektywności)

    ```sql
    CREATE TABLE efficiency_audits (
      id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      service_request_id UUID        NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
      file_url           TEXT        NOT NULL,
      uploaded_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    ```

---

## 2. Włączenie RLS i przykładowe polityki

1. **Aktywacja RLS** (dla każdej tabeli, która powinna mieć ograniczenia):

   ```sql
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
   ALTER TABLE audit_requests ENABLE ROW LEVEL SECURITY;
   ALTER TABLE contractor_portfolios ENABLE ROW LEVEL SECURITY;
   ALTER TABLE contractor_offers ENABLE ROW LEVEL SECURITY;
   ALTER TABLE auditor_portfolios ENABLE ROW LEVEL SECURITY;
   ALTER TABLE auditor_offers ENABLE ROW LEVEL SECURITY;
   ALTER TABLE opinions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
   ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
   ALTER TABLE efficiency_audits ENABLE ROW LEVEL SECURITY;
   ```

2. **Funkcja pomocnicza do odczytu roli i ID użytkownika**
   Supabase automatycznie udostępnia w kontekście RLS dwa kluczowe:

   * `auth.role()` zwraca rolę zalogowanego użytkownika (po skonfigurowaniu JWT z polem `role`).
   * `auth.uid()` zwraca jego `UUID`.

3. **Polityki dla każdej roli**

   * **Beneficjent (role = 'beneficiary')**

     * Może CRUDować własne zapytania w `service_requests` i `audit_requests`.

     ```sql
     -- SELECT w service_requests
     CREATE POLICY "Beneficiary can select own service_requests"
       ON service_requests
       FOR SELECT
       USING (auth.role() = 'beneficiary' AND auth.uid() = beneficiary_id);

     -- INSERT w service_requests
     CREATE POLICY "Beneficiary can insert service_requests"
       ON service_requests
       FOR INSERT
       WITH CHECK (auth.role() = 'beneficiary' AND auth.uid() = beneficiary_id);

     -- UPDATE w service_requests (tylko przed weryfikacją)
     CREATE POLICY "Beneficiary can update own service_requests"
       ON service_requests
       FOR UPDATE
       USING (auth.role() = 'beneficiary' AND auth.uid() = beneficiary_id AND status = 'pending');

     -- DELETE w service_requests (tylko gdy status = 'pending')
     CREATE POLICY "Beneficiary can delete own service_requests"
       ON service_requests
       FOR DELETE
       USING (auth.role() = 'beneficiary' AND auth.uid() = beneficiary_id AND status = 'pending');

     -- analogicznie dla audit_requests
     CREATE POLICY "Beneficiary can select own audit_requests"
       ON audit_requests
       FOR SELECT
       USING (auth.role() = 'beneficiary' AND auth.uid() = beneficiary_id);

     CREATE POLICY "Beneficiary can insert audit_requests"
       ON audit_requests
       FOR INSERT
       WITH CHECK (auth.role() = 'beneficiary' AND auth.uid() = beneficiary_id);

     CREATE POLICY "Beneficiary can update own audit_requests"
       ON audit_requests
       FOR UPDATE
       USING (auth.role() = 'beneficiary' AND auth.uid() = beneficiary_id AND status = 'pending');

     CREATE POLICY "Beneficiary can delete own audit_requests"
       ON audit_requests
       FOR DELETE
       USING (auth.role() = 'beneficiary' AND auth.uid() = beneficiary_id AND status = 'pending');
     ```

     * **Opinie (tabela opinions)** – może dodać tylko opinię swojego ID:

     ```sql
     CREATE POLICY "Beneficiary can insert opinion"
       ON opinions
       FOR INSERT
       WITH CHECK (auth.role() = 'beneficiary' AND auth.uid() = beneficiary_id);

     -- Wyświetlanie opinii dowolnych (np. każdy może je czytać):
     CREATE POLICY "Public can select opinions"
       ON opinions
       FOR SELECT
       USING (true);
     ```

   * **Wykonawca (role = 'contractor')**

     * Portfolio:

     ```sql
     CREATE POLICY "Contractor can manage own portfolio"
       ON contractor_portfolios
       FOR ALL
       USING (auth.role() = 'contractor' AND auth.uid() = contractor_id)
       WITH CHECK (auth.role() = 'contractor' AND auth.uid() = contractor_id);
     ```

     * Galerie:

     ```sql
     CREATE POLICY "Contractor can insert own gallery images"
       ON contractor_gallery
       FOR INSERT
       WITH CHECK (auth.role() = 'contractor' AND EXISTS (
         SELECT 1 FROM contractor_portfolios cp 
         WHERE cp.id = portfolio_id AND cp.contractor_id = auth.uid()
       ));

     CREATE POLICY "Contractor can select own gallery images"
       ON contractor_gallery
       FOR SELECT
       USING (auth.role() = 'contractor' AND EXISTS (
         SELECT 1 FROM contractor_portfolios cp 
         WHERE cp.id = portfolio_id AND cp.contractor_id = auth.uid()
       ));

     CREATE POLICY "Contractor can delete own gallery images"
       ON contractor_gallery
       FOR DELETE
       USING (auth.role() = 'contractor' AND EXISTS (
         SELECT 1 FROM contractor_portfolios cp 
         WHERE cp.id = portfolio_id AND cp.contractor_id = auth.uid()
       ));
     ```

     * Oferty:

     ```sql
     CREATE POLICY "Contractor can insert own offers"
       ON contractor_offers
       FOR INSERT
       WITH CHECK (auth.role() = 'contractor' AND auth.uid() = contractor_id);

     CREATE POLICY "Contractor can select own offers"
       ON contractor_offers
       FOR SELECT
       USING (auth.role() = 'contractor' AND auth.uid() = contractor_id);

     CREATE POLICY "Contractor can update own offers [tylko gdy pending]"
       ON contractor_offers
       FOR UPDATE
       USING (auth.role() = 'contractor' AND auth.uid() = contractor_id AND status = 'pending');

     CREATE POLICY "Contractor can delete own offers [tylko pending]"
       ON contractor_offers
       FOR DELETE
       USING (auth.role() = 'contractor' AND auth.uid() = contractor_id AND status = 'pending');
     ```

   * **Audytor (role = 'auditor')**

     * Portfolio:

     ```sql
     CREATE POLICY "Auditor can manage own portfolio"
       ON auditor_portfolios
       FOR ALL
       USING (auth.role() = 'auditor' AND auth.uid() = auditor_id)
       WITH CHECK (auth.role() = 'auditor' AND auth.uid() = auditor_id);
     ```

     * Oferty:

     ```sql
     CREATE POLICY "Auditor can insert own offers"
       ON auditor_offers
       FOR INSERT
       WITH CHECK (auth.role() = 'auditor' AND auth.uid() = auditor_id);

     CREATE POLICY "Auditor can select own offers"
       ON auditor_offers
       FOR SELECT
       USING (auth.role() = 'auditor' AND auth.uid() = auditor_id);

     CREATE POLICY "Auditor can update own offers [pending]"
       ON auditor_offers
       FOR UPDATE
       USING (auth.role() = 'auditor' AND auth.uid() = auditor_id AND status = 'pending');

     CREATE POLICY "Auditor can delete own offers [pending]"
       ON auditor_offers
       FOR DELETE
       USING (auth.role() = 'auditor' AND auth.uid() = auditor_id AND status = 'pending');
     ```

   * **Operator (role = 'operator')**

     * Pełny dostęp do moderowanych tabel (weryfikacja/odrzucanie/edycja statusów):

     ```sql
     -- Na przykład w service_requests:
     CREATE POLICY "Operator can select service_requests"
       ON service_requests
       FOR SELECT
       USING (auth.role() = 'operator');

     CREATE POLICY "Operator can update service_requests"
       ON service_requests
       FOR UPDATE
       USING (auth.role() = 'operator');

     CREATE POLICY "Operator can delete service_requests"
       ON service_requests
       FOR DELETE
       USING (auth.role() = 'operator');
     ```

     * Analogicznie dla: `audit_requests`, `contractor_offers`, `auditor_offers`, `moderation_logs`, `reports`, `efficiency_audits`.
     * W `moderation_logs` i `reports` można dodatkowo ograniczyć INSERT tylko do operatorów:

     ```sql
     CREATE POLICY "Operator can insert moderation_logs"
       ON moderation_logs
       FOR INSERT
       WITH CHECK (auth.role() = 'operator');

     CREATE POLICY "Operator can select moderation_logs"
       ON moderation_logs
       FOR SELECT
       USING (auth.role() = 'operator');
     ```

   * **Administrator (role = 'admin')**

     * Pełen dostęp do wszystkiego:

     ```sql
     CREATE POLICY "Admin can manage all tables"
       ON users
       FOR ALL
       USING (auth.role() = 'admin')
       WITH CHECK (auth.role() = 'admin');

     -- To samo dla pozostałych tabel:
     -- Ex.: service_requests, contractor_offers, itd.
     ```

---

## 3. Podsumowanie kroków wdrożeniowych

1. **Dodaj tabele wg powyższego schematu** (`CREATE TABLE ...`).

2. **Włącz RLS** na każdej tabeli, w której chcesz kontrolować dostęp (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).

3. **Upewnij się, że Supabase Auth zwraca w JWT pole `role` i `sub` (user ID)**.

   * W ustawieniach Supabase: w Custom JWT Claims musisz dodać `role` oraz `uid` (bądź użyć domyślnego `sub`).

4. **Utwórz polityki RLS** dokładnie wg roli i tabel, jak wyżej.

   * Beneficjent CRUD tylko własne wpisy w `service_requests`, `audit_requests`, `opinions`.
   * Wykonawca CRUD na `contractor_portfolios`, `contractor_gallery`, `contractor_offers`.
   * Audytor CRUD na `auditor_portfolios`, `auditor_offers`.
   * Operator pełny dostęp do moderacji: `service_requests`, `audit_requests`, `contractor_offers`, `auditor_offers`, `moderation_logs`, `reports`, `efficiency_audits`.
   * Admin pełen dostęp do całej bazy (`users` i wszystkie tabele).

5. **Dodatkowe indeksy** (opcjonalnie, dla wydajności):

   ```sql
   CREATE INDEX idx_service_requests_status ON service_requests(status);
   CREATE INDEX idx_audit_requests_status   ON audit_requests(status);
   CREATE INDEX idx_contractor_offers_status ON contractor_offers(status);
   CREATE INDEX idx_auditor_offers_status    ON auditor_offers(status);
   ```

6. **Przykładowe seedy lub użytkownicy testowi** (opcjonalnie, dla developmentu).

---

**Efekt końcowy**:

* Jedna tabela `users` z kolumną `role`.
* Osobne tabele dla treści biznesowej (zapytania, oferty, portfolio itp.), każda z kluczem obcym do `users(id)`.
* Row Level Security włączone na tabelach i polityki definiujące, kto i jakie operacje może wykonać.

Dzięki temu każdy użytkownik widzi tylko swoje dane, a operatorzy i administratorzy mają uprawnienia korygujące.
