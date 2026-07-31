"use client";

import { Player } from "@remotion/player";
import { RegistersShowcaseVideo, REGISTERS_SHOWCASE_DURATION } from "./RegistersShowcaseVideo";

/**
 * The Remotion player + its composition pull in ~150KB of JS that is not needed
 * for first paint. It lives in its own module so RemotionVideoWidget can load it
 * as a client-only dynamic chunk (ssr: false) after the hero has rendered.
 */
export default function RemotionPlayerInner() {
  return (
    <Player
      acknowledgeRemotionLicense={true}
      component={RegistersShowcaseVideo}
      durationInFrames={REGISTERS_SHOWCASE_DURATION}
      compositionWidth={1000}
      compositionHeight={800}
      fps={30}
      style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
      controls={false}
      autoPlay={true}
      loop={true}
      initiallyMuted={true}
    />
  );
}
