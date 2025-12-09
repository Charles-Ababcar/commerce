import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] gap-3",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start space-x-3 overflow-hidden rounded-2xl border p-5 pr-9 shadow-2xl transition-all duration-500 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full backdrop-blur-xl before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-10",
  {
    variants: {
      variant: {
        default: "border-border/40 bg-gradient-to-br from-background via-background to-muted/20 text-foreground before:from-primary/20 before:to-transparent",
        destructive: "border-destructive/30 bg-gradient-to-br from-destructive/15 via-destructive/10 to-destructive/5 text-destructive-foreground before:from-destructive/30 before:to-transparent shadow-[0_10px_40px_rgba(239,68,68,0.15)]",
        success: "border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-emerald-500/10 to-emerald-500/5 text-emerald-900 dark:text-emerald-100 before:from-emerald-500/30 before:to-transparent shadow-[0_10px_40px_rgba(16,185,129,0.15)]",
        warning: "border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-amber-500/10 to-amber-500/5 text-amber-900 dark:text-amber-100 before:from-amber-500/30 before:to-transparent shadow-[0_10px_40px_rgba(245,158,11,0.15)]",
        info: "border-blue-500/30 bg-gradient-to-br from-blue-500/15 via-blue-500/10 to-blue-500/5 text-blue-900 dark:text-blue-100 before:from-blue-500/30 before:to-transparent shadow-[0_10px_40px_rgba(59,130,246,0.15)]",
        premium: "border-violet-500/40 bg-gradient-to-br from-violet-500/20 via-violet-500/15 to-violet-500/10 text-violet-900 dark:text-violet-100 before:from-violet-500/40 before:via-purple-500/30 before:to-transparent shadow-[0_10px_40px_rgba(139,92,246,0.2)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Composant pour l'effet de brillance
const ShineEffect = ({ variant }: { variant?: string }) => {
  const variantColors: Record<string, string> = {
    default: "from-primary/20 via-primary/10 to-transparent",
    destructive: "from-destructive/20 via-destructive/10 to-transparent",
    success: "from-emerald-500/20 via-emerald-500/10 to-transparent",
    warning: "from-amber-500/20 via-amber-500/10 to-transparent",
    info: "from-blue-500/20 via-blue-500/10 to-transparent",
    premium: "from-violet-500/30 via-purple-500/20 to-transparent",
  };

  return (
    <>
      {/* Effet de brillance animé */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className={cn(
          "absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-20 animate-spin-slow",
          variantColors[variant || "default"]
        )}>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
        </div>
      </div>
      
      {/* Bordure lumineuse */}
      <div className={cn(
        "absolute inset-0 rounded-2xl border-2 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-500",
        variant === "default" && "border-primary/20",
        variant === "destructive" && "border-destructive/20",
        variant === "success" && "border-emerald-500/20",
        variant === "warning" && "border-amber-500/20",
        variant === "info" && "border-blue-500/20",
        variant === "premium" && "border-violet-500/30",
      )}></div>
    </>
  );
};

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & 
    VariantProps<typeof toastVariants> & {
      icon?: React.ReactNode;
    }
>(({ className, variant = "default", icon, children, ...props }, ref) => {
  const getDefaultIcon = () => {
    switch (variant) {
      case "destructive":
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 blur-md rounded-full"></div>
            <AlertCircle className="h-5 w-5 text-destructive relative z-10 mt-0.5" />
          </div>
        );
      case "success":
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full"></div>
            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 relative z-10 mt-0.5" />
          </div>
        );
      case "warning":
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-md rounded-full"></div>
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 relative z-10 mt-0.5" />
          </div>
        );
      case "info":
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full"></div>
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 relative z-10 mt-0.5" />
          </div>
        );
      case "premium":
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-violet-500/30 blur-md rounded-full"></div>
            <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400 relative z-10 mt-0.5" />
          </div>
        );
      default:
        return null;
    }
  };

  const defaultIcon = getDefaultIcon();
  const showIcon = icon !== undefined ? icon : defaultIcon;

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), "group", className)}
      {...props}
    >
      {/* Effets visuels */}
      <ShineEffect variant={variant} />
      
      {/* Contenu principal */}
      <div className="relative z-10 flex items-start space-x-3 w-full">
        {showIcon && (
          <div className="flex-shrink-0 mt-0.5">
            {showIcon}
          </div>
        )}
        
        <div className="flex-1 space-y-2 min-w-0">
          {children}
        </div>
      </div>
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-9 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-b from-white/10 to-transparent px-4 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-md hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "group-[.destructive]:border-destructive/40 group-[.destructive]:text-destructive-foreground group-[.destructive]:hover:bg-destructive/20 group-[.destructive]:focus:ring-destructive/30",
      "group-[.success]:border-emerald-500/40 group-[.success]:text-emerald-700 dark:group-[.success]:text-emerald-300 group-[.success]:hover:bg-emerald-500/20 group-[.success]:focus:ring-emerald-500/30",
      "group-[.warning]:border-amber-500/40 group-[.warning]:text-amber-700 dark:group-[.warning]:text-amber-300 group-[.warning]:hover:bg-amber-500/20 group-[.warning]:focus:ring-amber-500/30",
      "group-[.info]:border-blue-500/40 group-[.info]:text-blue-700 dark:group-[.info]:text-blue-300 group-[.info]:hover:bg-blue-500/20 group-[.info]:focus:ring-blue-500/30",
      "group-[.premium]:border-violet-500/50 group-[.premium]:text-violet-700 dark:group-[.premium]:text-violet-300 group-[.premium]:hover:bg-violet-500/20 group-[.premium]:focus:ring-violet-500/40",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-xl p-2 text-foreground/50 opacity-70 transition-all duration-300 hover:scale-110 hover:opacity-100 hover:bg-white/10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 disabled:pointer-events-none",
      "group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:hover:bg-red-600/30",
      "group-[.success]:text-emerald-300 group-[.success]:hover:text-emerald-50 group-[.success]:hover:bg-emerald-600/30",
      "group-[.warning]:text-amber-300 group-[.warning]:hover:text-amber-50 group-[.warning]:hover:bg-amber-600/30",
      "group-[.info]:text-blue-300 group-[.info]:hover:text-blue-50 group-[.info]:hover:bg-blue-600/30",
      "group-[.premium]:text-violet-300 group-[.premium]:hover:text-violet-50 group-[.premium]:hover:bg-violet-600/30",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold leading-none tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90 leading-relaxed", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};