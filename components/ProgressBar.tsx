"use client";

import { AppProgressBar } from "next-nprogress-bar";

export default function ProgressBar() {
  return (
    <AppProgressBar
      height="3px"
      color="#ff6b00"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
