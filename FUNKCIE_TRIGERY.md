-- Funkcje w schemacie public utworzone przez current_user
SELECT
  p.proname   AS function_name,
  pg_get_functiondef(p.oid) AS definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE
  n.nspname = 'public'
  AND pg_get_userbyid(p.proowner) = current_user
ORDER BY function_name;


[
  {
    "function_name": "create_user_points",
    "definition": "CREATE OR REPLACE FUNCTION public.create_user_points()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n    INSERT INTO user_points (user_id, balance) VALUES (NEW.id, 0);\n    RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "function_name": "create_user_with_points",
    "definition": "CREATE OR REPLACE FUNCTION public.create_user_with_points(user_email text, user_password_hash text, user_role text, user_name text, initial_points integer DEFAULT 0)\n RETURNS uuid\n LANGUAGE plpgsql\nAS $function$\nDECLARE\n    new_user_id UUID;\nBEGIN\n    -- Wstaw nowego użytkownika\n    INSERT INTO users (email, password_hash, role, name)\n    VALUES (user_email, user_password_hash, user_role, user_name)\n    RETURNING id INTO new_user_id;\n    \n    -- Dodaj początkowe punkty jeśli określone\n    IF initial_points > 0 THEN\n        PERFORM modify_user_points(new_user_id, initial_points, 'Initial points grant');\n    END IF;\n    \n    RETURN new_user_id;\nEND;\n$function$\n"
  },
  {
    "function_name": "get_operator_statistics",
    "definition": "CREATE OR REPLACE FUNCTION public.get_operator_statistics(from_date timestamp with time zone DEFAULT (now() - '30 days'::interval), to_date timestamp with time zone DEFAULT now())\n RETURNS jsonb\n LANGUAGE plpgsql\nAS $function$\nDECLARE\n    stats JSONB;\nBEGIN\n    SELECT jsonb_build_object(\n        'service_requests', jsonb_build_object(\n            'total', (SELECT COUNT(*) FROM service_requests WHERE created_at BETWEEN from_date AND to_date),\n            'pending', (SELECT COUNT(*) FROM service_requests WHERE status = 'pending' AND created_at BETWEEN from_date AND to_date),\n            'verified', (SELECT COUNT(*) FROM service_requests WHERE status = 'verified' AND created_at BETWEEN from_date AND to_date),\n            'rejected', (SELECT COUNT(*) FROM service_requests WHERE status = 'rejected' AND created_at BETWEEN from_date AND to_date)\n        ),\n        'audit_requests', jsonb_build_object(\n            'total', (SELECT COUNT(*) FROM audit_requests WHERE created_at BETWEEN from_date AND to_date),\n            'pending', (SELECT COUNT(*) FROM audit_requests WHERE status = 'pending' AND created_at BETWEEN from_date AND to_date),\n            'verified', (SELECT COUNT(*) FROM audit_requests WHERE status = 'verified' AND created_at BETWEEN from_date AND to_date),\n            'rejected', (SELECT COUNT(*) FROM audit_requests WHERE status = 'rejected' AND created_at BETWEEN from_date AND to_date)\n        ),\n        'users', jsonb_build_object(\n            'total_active', (SELECT COUNT(*) FROM users WHERE created_at BETWEEN from_date AND to_date),\n            'beneficiaries', (SELECT COUNT(*) FROM users WHERE role = 'beneficiary' AND created_at BETWEEN from_date AND to_date),\n            'contractors', (SELECT COUNT(*) FROM users WHERE role = 'contractor' AND created_at BETWEEN from_date AND to_date),\n            'auditors', (SELECT COUNT(*) FROM users WHERE role = 'auditor' AND created_at BETWEEN from_date AND to_date)\n        ),\n        'offers', jsonb_build_object(\n            'contractor_offers', (SELECT COUNT(*) FROM contractor_offers WHERE created_at BETWEEN from_date AND to_date),\n            'auditor_offers', (SELECT COUNT(*) FROM auditor_offers WHERE created_at BETWEEN from_date AND to_date),\n            'accepted_contractor_offers', (SELECT COUNT(*) FROM contractor_offers WHERE status = 'accepted' AND created_at BETWEEN from_date AND to_date),\n            'accepted_auditor_offers', (SELECT COUNT(*) FROM auditor_offers WHERE status = 'accepted' AND created_at BETWEEN from_date AND to_date)\n        ),\n        'opinions', jsonb_build_object(\n            'total', (SELECT COUNT(*) FROM opinions WHERE created_at BETWEEN from_date AND to_date),\n            'average_rating', (SELECT ROUND(AVG(rating), 2) FROM opinions WHERE created_at BETWEEN from_date AND to_date)\n        )\n    ) INTO stats;\n    \n    RETURN stats;\nEND;\n$function$\n"
  },
  {
    "function_name": "handle_offer_acceptance",
    "definition": "CREATE OR REPLACE FUNCTION public.handle_offer_acceptance()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n    -- Jeśli oferta została zaakceptowana\n    IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN\n        -- Odrzuć wszystkie inne oferty dla tego samego zapytania\n        IF TG_TABLE_NAME = 'contractor_offers' THEN\n            UPDATE contractor_offers \n            SET status = 'rejected', updated_at = NOW()\n            WHERE request_id = NEW.request_id \n            AND id != NEW.id \n            AND status = 'pending';\n        ELSIF TG_TABLE_NAME = 'auditor_offers' THEN\n            UPDATE auditor_offers \n            SET status = 'rejected', updated_at = NOW()\n            WHERE request_id = NEW.request_id \n            AND id != NEW.id \n            AND status = 'pending';\n        END IF;\n    END IF;\n    \n    RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "function_name": "log_moderation_action",
    "definition": "CREATE OR REPLACE FUNCTION public.log_moderation_action(operator_user_id uuid, target_table_name text, target_record_id uuid, action_performed text, action_reason text DEFAULT NULL::text)\n RETURNS uuid\n LANGUAGE plpgsql\nAS $function$\nDECLARE\n    log_id UUID;\nBEGIN\n    INSERT INTO moderation_logs (operator_id, target_table, target_id, action, reason, created_at)\n    VALUES (operator_user_id, target_table_name, target_record_id, action_performed, action_reason, NOW())\n    RETURNING id INTO log_id;\n    \n    RETURN log_id;\nEND;\n$function$\n"
  },
  {
    "function_name": "modify_user_points",
    "definition": "CREATE OR REPLACE FUNCTION public.modify_user_points(target_user_id uuid, points_change integer, transaction_reason text)\n RETURNS boolean\n LANGUAGE plpgsql\nAS $function$\nDECLARE\n    current_balance INTEGER;\nBEGIN\n    -- Sprawdź czy użytkownik istnieje\n    IF NOT EXISTS (SELECT 1 FROM users WHERE id = target_user_id) THEN\n        RAISE EXCEPTION 'User does not exist';\n    END IF;\n    \n    -- Pobierz aktualny bilans lub utwórz rekord z zerem\n    INSERT INTO user_points (user_id, balance, updated_at)\n    VALUES (target_user_id, 0, NOW())\n    ON CONFLICT (user_id) DO NOTHING;\n    \n    SELECT balance INTO current_balance \n    FROM user_points \n    WHERE user_id = target_user_id;\n    \n    -- Sprawdź czy użytkownik ma wystarczające środki (jeśli odejmujemy)\n    IF points_change < 0 AND current_balance + points_change < 0 THEN\n        RAISE EXCEPTION 'Insufficient points balance';\n    END IF;\n    \n    -- Zaktualizuj saldo\n    UPDATE user_points \n    SET balance = balance + points_change,\n        updated_at = NOW()\n    WHERE user_id = target_user_id;\n    \n    -- Dodaj wpis do historii transakcji\n    INSERT INTO points_transactions (user_id, change, reason, created_at)\n    VALUES (target_user_id, points_change, transaction_reason, NOW());\n    \n    RETURN TRUE;\nEND;\n$function$\n"
  },
  {
    "function_name": "update_updated_at_column",
    "definition": "CREATE OR REPLACE FUNCTION public.update_updated_at_column()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n    NEW.updated_at = NOW();\n    RETURN NEW;\nEND;\n$function$\n"
  }
]


-- Triggery w schemacie public utworzone przez current_user
SELECT
  t.tgname                       AS trigger_name,
  c.relname                      AS table_name,
  pg_get_triggerdef(t.oid, true) AS definition
FROM pg_trigger t
JOIN pg_class c    ON t.tgrelid      = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE
  NOT t.tgisinternal
  AND n.nspname = 'public'
  AND pg_get_userbyid(c.relowner) = current_user
ORDER BY table_name, trigger_name;


[
  {
    "trigger_name": "update_audit_requests_updated_at",
    "table_name": "audit_requests",
    "definition": "CREATE TRIGGER update_audit_requests_updated_at BEFORE UPDATE ON audit_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "trigger_name": "on_auditor_offer_status_change",
    "table_name": "auditor_offers",
    "definition": "CREATE TRIGGER on_auditor_offer_status_change AFTER UPDATE OF status ON auditor_offers FOR EACH ROW EXECUTE FUNCTION handle_offer_acceptance()"
  },
  {
    "trigger_name": "update_auditor_offers_updated_at",
    "table_name": "auditor_offers",
    "definition": "CREATE TRIGGER update_auditor_offers_updated_at BEFORE UPDATE ON auditor_offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "trigger_name": "update_auditor_portfolios_updated_at",
    "table_name": "auditor_portfolios",
    "definition": "CREATE TRIGGER update_auditor_portfolios_updated_at BEFORE UPDATE ON auditor_portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "trigger_name": "on_contractor_offer_status_change",
    "table_name": "contractor_offers",
    "definition": "CREATE TRIGGER on_contractor_offer_status_change AFTER UPDATE OF status ON contractor_offers FOR EACH ROW EXECUTE FUNCTION handle_offer_acceptance()"
  },
  {
    "trigger_name": "update_contractor_offers_updated_at",
    "table_name": "contractor_offers",
    "definition": "CREATE TRIGGER update_contractor_offers_updated_at BEFORE UPDATE ON contractor_offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "trigger_name": "update_contractor_portfolios_updated_at",
    "table_name": "contractor_portfolios",
    "definition": "CREATE TRIGGER update_contractor_portfolios_updated_at BEFORE UPDATE ON contractor_portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "trigger_name": "update_operator_contacts_updated_at",
    "table_name": "operator_contacts",
    "definition": "CREATE TRIGGER update_operator_contacts_updated_at BEFORE UPDATE ON operator_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "trigger_name": "update_service_requests_updated_at",
    "table_name": "service_requests",
    "definition": "CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "trigger_name": "update_users_updated_at",
    "table_name": "users",
    "definition": "CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
  }
]