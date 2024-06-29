import { ElementRef, useRef, useState } from "react";

function App() {
  return <Recorder />;
}

export default App;

// const containers = [
//   "webm",
//   "ogg",
//   "mp4",
//   "x-matroska",
//   "3gpp",
//   "3gpp2",
//   "3gp2",
//   "quicktime",
//   "mpeg",
//   "aac",
//   "flac",
//   "wav",
// ];
// const codecs = [
//   "opus",
//   "vp9",
//   "vp8",
//   "avc1",
//   "av1",
//   "h265",
//   "h.265",
//   "h264",
//   "h.264",
//   "pcm",
//   "aac",
//   "mpeg",
//   "mp4a",
// ];

// const supportedAudios = containers
//   .map((format) => `audio/${format}`)
//   .filter((mimeType) => MediaRecorder.isTypeSupported(mimeType));
// const supportedAudioCodecs = supportedAudios
//   .flatMap((audio) => codecs.map((codec) => `${audio};codecs=${codec}`))
//   .filter((mimeType) => MediaRecorder.isTypeSupported(mimeType));

// console.log("Supported Audio formats:", supportedAudios);
// console.log("Supported Audio codecs:", supportedAudioCodecs);

// const supportedVideos = containers
//   .map((format) => `video/${format}`)
//   .filter((mimeType) => MediaRecorder.isTypeSupported(mimeType));
// const supportedVideoCodecs = supportedVideos
//   .flatMap((video) => codecs.map((codec) => `${video};codecs=${codec}`))
//   .filter((mimeType) => MediaRecorder.isTypeSupported(mimeType));

// console.log("Supported Video formats:", supportedVideos);
// console.log("Supported Video codecs:", supportedVideoCodecs);

function Recorder() {
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const videoRef = useRef<ElementRef<"video">>(null);
  async function start() {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: {
        echoCancellation: false,
        autoGainControl: false,
        noiseSuppression: false,
      },
      video: true,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }

    const rec = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=h264",
    });

    try {
      rec.start();
    } catch (e) {
      console.warn(e);
    }

    setRecorder(rec);

    console.log(stream);
  }

  async function stop() {
    if (!recorder) {
      return;
    }
    recorder.addEventListener("dataavailable", (ev) => {
      const a = document.createElement("a");
      // document.body.appendChild(a);
      const url = URL.createObjectURL(
        new Blob([ev.data], {
          type: "video/webm",
        }),
      );
      a.href = url;
      a.download = "audio-recorded";
      a.click();
      URL.revokeObjectURL(a.href);
      a.remove();
    });
    const data = recorder.stop();
    console.log(data);
  }

  return (
    <div className="flex flex-col p-2">
      Share the entire screen and enable "include system audio" in the selector.
      The recording system audio function only work on Window's Chrome.
      <div className="flex">
        <button className="px-4 py-2 hover:bg-neutral-500/20" onClick={start}>
          Record
        </button>
        <button className="px-4 py-2 hover:bg-neutral-500/20" onClick={stop}>
          Stop
        </button>
      </div>
      <video
        ref={videoRef}
        id="video-el"
        className="aspect-auto w-full border"
        muted
      />
    </div>
  );
}
