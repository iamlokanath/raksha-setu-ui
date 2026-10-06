import { colorVariables } from "./colors";
import { spacing } from "./spacing";
import { typography } from "./typography";

export const themeStyle = `:root { ${colorVariables} --rs-font: ${typography.fontFamily}; --rs-space: ${spacing.md}; --rs-control: ${spacing.control}; }`;
