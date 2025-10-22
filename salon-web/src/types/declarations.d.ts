// Minimal module declarations to satisfy TypeScript for packages without types
declare module 'react-flatpickr';

declare module 'react-google-recaptcha' {
  import * as React from 'react';

  export interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (value: string | null) => void;
    onExpired?: () => void;
    onErrored?: () => void;
    theme?: string;
    size?: 'compact' | 'normal';
    tabindex?: number;
    hl?: string;
  }

  export default class ReCAPTCHA extends React.Component<ReCAPTCHAProps> {
    executeAsync(): Promise<string>;
    reset(): void;
    getValue(): string | null;
  }
}
