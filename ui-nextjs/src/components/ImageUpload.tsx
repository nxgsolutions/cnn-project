"use client"

import { useState } from "react"
import axios from "axios"
import { Loader, UploadCloud } from "lucide-react"
import { Button } from "./ui/button"
const ImageUpload = () => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [responseMsg, setResponseMsg] = useState<string>("")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await axios.post(
        "http://localhost:8001/predict",
        formData
      )
      setResponseMsg(response.data.predictions)
    } catch (error) {
      console.error("Error uploading file:", error)
      setResponseMsg("Upload Failed!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg w-96 mx-auto mt-20">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="fileInput"
      />
      <label
        htmlFor="fileInput"
        className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        <UploadCloud size={20} /> Choose Image
      </label>
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-md border"
        />
      )}
      <Button
        onClick={handleUpload}
        disabled={!file || loading}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
      >
        {loading ? (
          <Loader size={24} className="animate-spin" />
        ) : (
          "Upload Image"
        )}
      </Button>
      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
        {responseMsg}
      </p>
    </div>
  )
}

export default ImageUpload
