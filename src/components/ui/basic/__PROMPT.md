// src/components/ui/basic/ComponentDocs.ts
/**
 * 📄 Ultra-skrócona dokumentacja props dla LLM:
 */
export const ComponentDocs = {
  ActionCard: {
    props: {
      icon: "React.ReactNode",
      title: "string",
      actions: "Array<{ label: string; onClick: () => void; variant?: 'primary'|'outline'; icon?: React.ReactNode }>",
      color?: "'blue'|'green'|'purple'|'red'|'yellow'  // domyślnie 'blue'"
    }
  },
  Alert: {
    props: {
      type?: "'error'|'success'|'warning'|'info'  // domyślnie 'info'",
      title: "string",
      message: "string",
      onRetry?: "() => void",
      className?: "string"
    }
  },
  Avatar: {
    props: {
      name?: "string",
      size?: "'sm'|'md'|'lg'  // domyślnie 'md'",
      className?: "string"
    }
  },
  BaseGrid: {
    props: {
      children: "React.ReactNode",
      colsMobile?: "number  // domyślnie 1",
      colsDesktop?: "number  // domyślnie 3",
      gap?: "string  // domyślnie 'gap-6'"
    }
  },
  Button: {
    props: {
      children: "React.ReactNode",
      variant?: "'primary'|'secondary'|'outline'|'ghost'  // domyślnie 'outline'",
      size?: "'sm'|'md'|'lg'  // domyślnie 'md'",
      onClick?: "() => void",
      className?: "string",
      icon?: "React.ReactNode",
      fullWidth?: "boolean",
      disabled?: "boolean"
    }
  },
  Card: {
    props: {
      children: "React.ReactNode",
      className?: "string"
    }
  },
  InfoField: {
    props: {
      label: "string",
      value: "string",
      className?: "string"
    }
  },
  LoadingSpinner: {
    props: {
      size?: "'sm'|'md'|'lg'  // domyślnie 'md'",
      className?: "string"
    }
  },
  LoadingState: {
    props: {
      loading: "boolean",
      size?: "'sm'|'md'|'lg'  // domyślnie 'md'",
      children: "React.ReactNode"
    }
  },
  Section: {
    props: {
      children: "React.ReactNode",
      bg?: "string  // np. 'bg-gray-50'"
    }
  },
  SectionHeader: {
    props: {
      title: "string",
      subtitle?: "string",
      actionLabel?: "string",
      onAction?: "() => void",
      actionIcon?: "React.ReactNode",
      actionVariant?: "'primary'|'outline'|'secondary'|'ghost'  // domyślnie 'primary'"
    }
  },
  StatCard: {
    props: {
      icon: "React.ReactNode",
      title: "string",
      value: "string|number",
      subtitle?: "string",
      color?: "'blue'|'green'|'purple'|'red'|'yellow'  // domyślnie 'blue'"
    }
  },
  EmptyState: {
    props: {
      icon: "React.ReactNode",
      title: "string",
      message: "string",
      actionLabel?: "string",
      onAction?: "() => void"
    }
  },
  ErrorState: {
    props: {
      error: "any",
      title?: "string  // domyślnie 'Wystąpił błąd'",
      message?: "string  // domyślnie 'Spróbuj ponownie.'",
      onRetry: "() => void",
      children: "React.ReactNode"
    }
  },
  Hero: {
    props: {
      title: "string",
      subtitle?: "string",
      center?: "boolean"
    }
  }
};
