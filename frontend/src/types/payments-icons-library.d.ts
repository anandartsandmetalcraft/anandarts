declare module "payments-icons-library" {
  export type PaymentIcon = {
    icon_name: string;
    icon_url: string;
    icon_version: string;
  };

  const paymentIcons: {
    getIcon: (name: string, size?: "sm" | "md" | "lg" | "svg") => PaymentIcon;
    getIcons: (names: string[], size?: "sm" | "md" | "lg" | "svg") => PaymentIcon[];
    getModesIcons: (mode: string, size?: "sm" | "md" | "lg" | "svg") => PaymentIcon[];
  };

  export default paymentIcons;
}
