import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";
import "./FaceExprations.scss";

const moodDetails = {
  happy: { emoji: "☀", label: "Happy" },
  sad: { emoji: "☾", label: "Sad" },
  surprised: { emoji: "✦", label: "Surprised" },
  Neutral: { emoji: "◌", label: "Neutral" },
};

export default function FaceExpression({
  onClick = () => {},
  isLoading = false,
  error = "",
}) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraStatus, setCameraStatus] = useState("starting");
  const [cameraError, setCameraError] = useState("");
  const [expression, setExpression] = useState("");
  const [detectionMessage, setDetectionMessage] = useState("");
  const [cameraAttempt, setCameraAttempt] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      try {
        const initialized = await init({
          landmarkerRef,
          videoRef,
          streamRef,
          isActive: () => isMounted,
        });
        if (isMounted && initialized) setCameraStatus("ready");
      } catch (cameraError) {
        console.error("Could not initialize the mood camera:", cameraError);
        if (isMounted) {
          setCameraError(
            cameraError instanceof Error
              ? cameraError.message
              : "Camera access could not be started.",
          );
          setCameraStatus("error");
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.srcObject = null;
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, [cameraAttempt]);

  const retryCamera = () => {
    setCameraError("");
    setCameraStatus("starting");
    setCameraAttempt((attempt) => attempt + 1);
  };

  const handleDetect = () => {
    setDetectionMessage("");
    const detectedMood = detect({ landmarkerRef, videoRef, setExpression });

    if (!detectedMood) {
      setDetectionMessage("We couldn’t see a face just yet. Try facing the camera.");
      return;
    }

    onClick(detectedMood);
  };

  const currentMood = moodDetails[expression] || {
    emoji: "✦",
    label: expression,
  };

  return (
    <section className="mood-card" aria-label="Mood-based music discovery">
      <div className="mood-card__top">
        <div>
          <span className="mood-card__eyebrow">YOUR MOOD STUDIO</span>
          <h2>Find your frequency</h2>
        </div>
        <span className={`camera-status camera-status--${cameraStatus}`}>
          <i />
          {cameraStatus === "ready"
            ? "Camera ready"
            : cameraStatus === "error"
              ? "Camera offline"
              : "Warming up"}
        </span>
      </div>

      <div className={`mood-camera mood-camera--${cameraStatus}`}>
        <video ref={videoRef} autoPlay muted playsInline aria-label="Camera preview" />
        <div className="mood-camera__frame" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        {cameraStatus === "ready" && (
          <span className="mood-camera__live">
            <i />
            LIVE
          </span>
        )}
        {cameraStatus !== "ready" && (
          <div className="mood-camera__overlay" role="status">
            <span className="mood-camera__overlay-icon" aria-hidden="true">
              {cameraStatus === "error" ? "!" : "◌"}
            </span>
            <strong>
              {cameraStatus === "error" ? "Camera needs a moment" : "Setting the scene"}
            </strong>
            <span>
              {cameraStatus === "error"
                ? "Allow camera access to discover your mood."
                : "Getting your mood studio ready…"}
            </span>
            {cameraStatus === "error" && (
              <button
                className="mood-camera__retry"
                type="button"
                onClick={retryCamera}
              >
                Try again
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mood-result" aria-live="polite">
        <div className="mood-result__icon" aria-hidden="true">
          {currentMood.emoji}
        </div>
        <div className="mood-result__copy">
          <span>{expression ? "YOUR VIBE RIGHT NOW" : "READY WHEN YOU ARE"}</span>
          <strong>{expression ? currentMood.label : "Let’s check in"}</strong>
        </div>
        <div className="mood-result__equalizer" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>

      {(cameraError || detectionMessage || error) && (
        <p className="mood-card__message" role="status">
          {cameraError || detectionMessage || error}
        </p>
      )}

      <button
        className="mood-card__button"
        type="button"
        onClick={handleDetect}
        disabled={cameraStatus !== "ready" || isLoading}
      >
        <span>{isLoading ? "Finding your track…" : "Find my mood"}</span>
        <span className="mood-card__button-icon" aria-hidden="true">
          {isLoading ? "…" : "↗"}
        </span>
      </button>
      <p className="mood-card__hint">
        {isLoading ? "Picking a track for this moment" : "One quick check-in. One just-right track."}
      </p>
    </section>
  );
}
