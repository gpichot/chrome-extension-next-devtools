export type PagePropsRequest = {
  url: string;
  status: number;
  content: {
    pageProps: unknown;
  };
};

export type SizeThreshold = "small" | "medium" | "large";
