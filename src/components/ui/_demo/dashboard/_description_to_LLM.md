## 🎛️ Komponenty i ich propsy

### Card
```
children, className, padding
```

### Button  
```
children, variant (primary|outline|ghost|danger), size (sm|md|lg), onClick, icon, fullWidth, disabled
```

### Avatar
```
name, src, size (xs|sm|md|lg|xl), onClick, status (online|offline|away|busy)
```

### Alert
```
type (error|success|warning|info), title, message, children, onClose, onAction, actionLabel
```

### LoadingSpinner
```
size (sm|md|lg), className
```

### InfoField
```
label, value, className
```

### StatCard
```
icon, title, value, subtitle, color (blue|green|purple|red|yellow)
```

### ActionCard
```
icon, title, actions[{label, onClick, variant, icon}], color
```

### UserHeader
```
name, email, id, avatar
```

### ActivityFeed
```
items[{text, timestamp, type}]
```

### NavigationLinks
```
sections[{title, icon, links[{label, onClick, icon}]}]
```

### DashboardLayout
```
children, maxWidth, padding
```

### GridLayout
```
children, columns (1|2|3), gap
```

### SectionHeader
```
icon, title, subtitle
```