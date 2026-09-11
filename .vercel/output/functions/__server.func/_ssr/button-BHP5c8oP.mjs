import { o as __toESM } from "../_runtime.mjs";
import { H as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-DzenR1kc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-BHP5c8oP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none min-h-11 px-5", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:bg-accent-2",
			secondary: "border border-border bg-surface-2 text-fg hover:bg-surface-3",
			ghost: "text-fg hover:bg-surface-2",
			link: "text-fg underline-offset-4 hover:underline px-0 min-h-0"
		},
		size: {
			default: "text-sm tracking-wide",
			sm: "min-h-9 px-3 text-xs",
			lg: "min-h-12 px-7 text-base"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "default"
	}
});
var Button = (0, import_react.forwardRef)(({ className, variant, size, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
	ref,
	className: cn(buttonVariants({
		variant,
		size
	}), className),
	...props
}));
Button.displayName = "Button";
//#endregion
export { Button as t };
