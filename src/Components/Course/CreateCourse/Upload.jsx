import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { useSelector } from "react-redux";

import "video-react/dist/video-react.css";
import { Player } from "video-react";

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  pdf = false,
  viewData = null,
  editData = null,
}) {
  const { course } = useSelector((state) => state.course || {});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  );
  const inputRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      previewFile(file);
      setSelectedFile(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: pdf
      ? { "application/pdf": [".pdf"] }
      : video
      ? { "video/*": [".mp4"] }
      : { "image/*": [".jpeg", ".jpg", ".png"] },
    onDrop,
  });

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  useEffect(() => {
    register(name, { required: true });
  }, [register, name]);

  useEffect(() => {
    setValue(name, selectedFile);
  }, [selectedFile, setValue, name]);

  return (
    <div className="flex flex-col p-2 space-y-2 shadow-lg bg-slate-50">
      <label className="text-sm bg-slate-50 text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>
      <div
        className={`${
          isDragActive ? "bg-slate-50" : "bg-white"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
      >
        {previewSource ? (
          <div className="flex flex-col w-full p-6">
            {!video && !pdf ? (
              <img
                src={previewSource}
                alt="Preview"
                className="object-cover w-full h-full rounded-md"
              />
            ) : video ? (
              <Player aspectRatio="16:9" playsInline src={previewSource} />
            ) : (
              <iframe
                src={previewSource}
                title="PDF Preview"
                className="w-full h-[300px] border rounded-md"
              ></iframe>
            )}
            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("");
                  setSelectedFile(null);
                  setValue(name, null);
                }}
                className="mt-3 underline text-richblack-400"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div
            className="flex flex-col items-center w-full p-6"
            {...getRootProps()}
          >
            <input {...getInputProps()} ref={inputRef} />
            <div className="grid rounded-full aspect-square w-14 place-items-center bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-500" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Drag and drop a {!video && !pdf ? "image" : video ? "video" : "PDF"}, or click to{" "}
              <span className="font-semibold text-yellow-500">Browse</span> a file
            </p>
            <ul className="flex justify-between mt-10 space-x-12 text-xs text-center list-disc text-richblack-200">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>
      {errors?.[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}
