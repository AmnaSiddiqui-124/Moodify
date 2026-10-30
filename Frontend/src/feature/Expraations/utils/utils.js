import {
    FaceLandmarker,
    FilesetResolver
} from "@mediapipe/tasks-vision";


export const init = async ({
    landmarkerRef,
    videoRef,
    streamRef,
    isActive = () => true
}) => {
    let landmarker;
    let stream;

    try {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        if (!isActive()) return false;

        landmarker = await FaceLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
                },
                outputFaceBlendshapes: true,
                runningMode: "VIDEO",
                numFaces: 1
            }
        );
        if (!isActive()) {
            landmarker.close();
            return false;
        }

        landmarkerRef.current = landmarker;
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (!isActive()) {
            stream.getTracks().forEach((track) => track.stop());
            landmarker.close();
            if (landmarkerRef.current === landmarker) landmarkerRef.current = null;
            return false;
        }

        streamRef.current = stream;
        if (!videoRef.current) {
            throw new Error("The camera preview is unavailable.");
        }
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        return isActive();
    } catch (error) {
        stream?.getTracks().forEach((track) => track.stop());
        if (streamRef.current === stream) streamRef.current = null;
        if (landmarker) {
            landmarker.close();
            if (landmarkerRef.current === landmarker) landmarkerRef.current = null;
        }
        throw error;
    }
};

export const detect = ({ landmarkerRef, videoRef, setExpression }) => {
    const video = videoRef.current;
    if (
        !landmarkerRef.current ||
        !video ||
        video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
        !video.videoWidth ||
        !video.videoHeight
    ) return;

    const results = landmarkerRef.current.detectForVideo(
        video,
        performance.now()
    );

    if (results.faceBlendshapes?.length > 0) {
        const blendshapes = results.faceBlendshapes[ 0 ].categories;

        const getScore = (name) =>
            blendshapes.find((b) => b.categoryName === name)?.score || 0;

        const smileLeft = getScore("mouthSmileLeft");
        const smileRight = getScore("mouthSmileRight");
        const jawOpen = getScore("jawOpen");
        const browUp = getScore("browInnerUp");
        const frownLeft = getScore("mouthFrownLeft");
        const frownRight = getScore("mouthFrownRight");

        let currentExpression = "Neutral";

        if (smileLeft > 0.5 && smileRight > 0.5) {
            currentExpression = "happy";
        } else if (jawOpen > 0.2 && browUp > 0.2) {
            currentExpression = "surprised";
        } else if (frownLeft > 0.0001 && frownRight > 0.0001) {
            currentExpression = "sad";
        }

        setExpression(currentExpression);

        return currentExpression
    }
};