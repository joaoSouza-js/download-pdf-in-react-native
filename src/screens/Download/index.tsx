import { useEffect, useState } from "react"
import { View, Text, Platform, Alert } from "react-native"
import * as FileSystem from "expo-file-system"
import { styles } from "./styles"
import { Button } from "@/components/Button"
import * as Sharing  from "expo-sharing"
const PDF_NAME = "doddc.pdf"
//const PDF_URI = "https://www.thecampusqdl.com/uploads/files/pdf_sample_2.pdf" // leve.
const PDF_URI = "https://www.mcfadden.com.br/assets/pdf/Flofi.pdf" // pesado


export function Download() {
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)

  function onDownLoadProgress({totalBytesExpectedToWrite,totalBytesWritten}: FileSystem.DownloadProgressData){
    const progress = (totalBytesWritten / totalBytesExpectedToWrite)  * 100
    const progressFormatted = Number(progress.toFixed(0)) 
    setProgressPercentage(progressFormatted)
    
  }

  async function saveFile(fileUrI: string, fileName: string){
    if(Platform.OS === "android"){
      const directoryUri = FileSystem.cacheDirectory + fileName

      const base64File = await FileSystem.readAsStringAsync(fileUrI, {
        encoding: FileSystem.EncodingType.Base64,
      })

      await FileSystem.writeAsStringAsync(directoryUri,base64File,{
        encoding: FileSystem.EncodingType.Base64,
      })

      await Sharing.shareAsync(directoryUri)
    }
    if(Platform.OS === "ios"){
        Sharing.shareAsync(fileUrI)
    }
  }
  

  
  async function handleDownload() {
    setIsDownloading(true)
    try {
      const filePath = `${FileSystem.documentDirectory}/${PDF_NAME}`
      const downloadResumable =  FileSystem.createDownloadResumable(PDF_URI, filePath,{}, onDownLoadProgress)

      const downloadResponse = await downloadResumable.downloadAsync()

      if(downloadResponse?.status === 200) {
        saveFile(downloadResponse.uri, PDF_NAME)
      }
    } catch (error) {
      Alert.alert("Download Error", "An error occurred while downloading the PDF file. Please try again later.")

    }
    finally {
      setIsDownloading(false)
      setProgressPercentage(0)
    }

  } 

  return (
    <View style={styles.container}>
      <Button isLoading={isDownloading} onPress={handleDownload}>
        download
      </Button>
      {
        progressPercentage > 0  && (
          <Text style={styles.progress}>
            {progressPercentage}%
          </Text>

        )
      }
    </View>
  )
}
