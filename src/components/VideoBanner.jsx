import video from "../assets/video.mp4";
import "../styles/VideoBanner.css";

export default function VideoBanner() {
  return (
    <div className="video-banner">
      <video
        className="banner-video"
        src={video}
        autoPlay
        muted
        playsInline
        onEnded={(e) => {
          e.target.pause();
          e.target.currentTime = 0;
        }}
      ></video>
    </div>
  );
}