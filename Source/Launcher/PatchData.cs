// Fixed CVM 4.1.4 instruction plan. Addresses are RVAs.
internal static partial class Program {
 internal static readonly Patch[] Patches=new Patch[] {
  new Patch("direct-entry-parent-check",0x6daf0d,"e87e90aaff","b001909090"),
  new Patch("no-launcher-pipe",0x6cd172,"0f85ec000000","e9bd07000090"),
  new Patch("do-not-start-account-worker",0x121a40,"48895c241855","31c0c3909090"),
  new Patch("local-config-after-snapshot",0x6cee31,"0f857d040000","e98e05000090"),
  new Patch("local-runtime-start",0x665280,"48895c240848","b801000000c3"),
  new Patch("local-runtime-permit",0x141f50,"48895c241056","b801000000c3"),
  new Patch("no-enforcement-file-deletion",0x177670,"48895c242055","b801000000c3"),
  new Patch("local-domain-permission",0x141cf0,"48895c240848","b801000000c3"),
  new Patch("local-aggregate-permission",0x141ea0,"48895c241056","b801000000c3"),
  new Patch("local-trt-status",0x1eed6c,"0fb605c9d3190190","b801000000909090"),
  new Patch("local-trt-build-check-1",0x1f1a53,"0fb605e2a6190190","b801000000909090"),
  new Patch("local-trt-build-check-2",0x1f210d,"0fb60528a0190190","b801000000909090"),
  new Patch("local-ui-auto-start",0x321664,"0f85b6000000","e9b700000090"),
  new Patch("local-ui-start-load",0x320dad,"0f85d1000000","e9d200000090"),
  new Patch("show-local-start-stop",0x36d992,"0fb69eb8150000","b3019090909090"),
  new Patch("hide-unused-account-login",0x36d9f1,"0f94c3","30db90"),
  new Patch("no-vendor-http-app-auth",0x15a3fa,"ff1510c38100","31c090909090"),
  new Patch("no-vendor-http-managed-model",0x1620e6,"ff1524468100","31c090909090"),
  new Patch("no-vendor-http-selfcheck",0x176008,"ff1502078000","31c090909090"),
  new Patch("no-vendor-http-binary-trust",0x1865f2,"ff1518017f00","31c090909090"),
  new Patch("no-vendor-http-error-report",0x1966d9,"ff1531007e00","31c090909090"),
  new Patch("no-vendor-http-parameters",0x19b84c,"ff15beae7d00","31c090909090"),
  new Patch("no-vendor-http-usage-census",0x1a313f,"ff15cb357d00","31c090909090"),
  new Patch("no-usage-report-dispatch",0x1a3430,"48895c24084c","31c0c3909090"),
 };
}
