declare module "qrcode" {
  const toFile: (path: string, text: string, options?: any) => Promise<void>;
  const toDataURL: (text: string, options?: any) => Promise<string>;
  export { toFile, toDataURL };
}
