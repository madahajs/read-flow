import apiClient from './api'

export const extractText = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  // Note: apiClient is configured with 'application/json', but axios handles FormData content-type automatically
  // or we can explicitly set it to multipart/form-data, but leaving it usually works as Axios detects it.
  // Explicitly setting it to be safe, though Axios usually strips it to let browser set boundary.

  const response = await apiClient.post('/ocr/extract', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  // Assuming response structure matches: { code: 200, data: { text: "...", ... } }
  if (response.data.code === 200) {
    return response.data.data.text
  }
  throw new Error(response.data.message || 'OCR failed')
}
