import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useGroupStore } from "../store/useGroupStore";
import { encryptImage } from "../lib/imageCrypto";
import { Image, Send, X, Mic } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const { sendMessage } = useChatStore();
  const { selectedGroup } = useGroupStore();
  const { aiReply, setAiReply } = useChatStore();
  const { generateReply } = useChatStore();
  // IMAGE
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Select image only");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  //  VOICE RECORD
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });

        const reader = new FileReader();
        reader.onloadend = () => setAudioBlob(reader.result);
        reader.readAsDataURL(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast.error("Mic permission denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // SEND
  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview && !audioBlob) return;

    try {
      let encryptedImage = null;

if (imagePreview) {
  // convert base64 → file → encrypt
  const res = await fetch(imagePreview);
  const blob = await res.blob();
  const file = new File([blob], "image.png");

  encryptedImage = await encryptImage(file);
}

await sendMessage({
  text: text.trim(),
  image: encryptedImage, // 🔥 encrypted instead of raw
  audio: audioBlob,
  groupId: selectedGroup?._id,
});
      setText("");
      setImagePreview(null);
      setAudioBlob(null);

      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Send failed");
    }
  };

  return (
    <div className="p-4 w-full">
      {/* IMAGE PREVIEW */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1 -right-1 bg-base-300 rounded-full p-1"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* AUDIO */}
      {audioBlob && (
        <div className="mb-3">
          <audio controls src={audioBlob}></audio>
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          {/* TEXT */}
          <input
            type="text"
            className="w-full input input-bordered"
            placeholder="Type message or @ai..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setAiReply("");
            }}
          />

          {/* FILE */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* IMAGEBTN */}
          <button
            type="button"
            className="btn btn-circle"
            onClick={() => fileInputRef.current.click()}
          >
            <Image size={18} />
          </button>

          {/* MICBTN */}
          <button
            type="button"
            className={`btn btn-circle ${isRecording ? "text-red-500" : ""
              }`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            <Mic size={18} />
          </button>
        </div>
        {/*emo reply */}
        <button
          type="button"
          className="btn btn-sm"
          onClick={async () => {
            const messages = useChatStore.getState().messages;
            const lastMsg = messages[messages.length - 1];

            if (!lastMsg?.text) return;

            const res = await generateReply(lastMsg.text);

            // 🔥 DIRECTLY SET TEXT
            setText(res);
          }}
        >
          🤖 Reply with EMO
        </button>
        {/* SEND */}
        <button
          type="submit"
          className="btn btn-circle"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;