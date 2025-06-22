import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Button, Modal } from '@nayeshdaggula/tailify'
import { getCroppedImg } from './getCroppedImg'

const ImageCropperModal = ({ imageSrc, onClose, onCropDone }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleDone = async () => {
        const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
        onCropDone(croppedBlob)
    }

    return (
        <>
            <Modal
                open={true}
                size="50%"
                withCloseButton={false}
                margin="0px"
                padding="0px"
                onClose={onClose}>
                <div className="relative w-[90vw] h-[70vh]">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={4 / 3}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleDone}>Crop & Upload</Button>
                </div>
            </Modal>
        </>
    )
}

export default ImageCropperModal
