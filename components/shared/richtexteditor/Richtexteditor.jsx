// import React, { useRef, useEffect, useState } from 'react'
// import { useEditor, EditorContent } from '@tiptap/react'
// import StarterKit from '@tiptap/starter-kit'
// import Underline from '@tiptap/extension-underline'
// import Image from '@tiptap/extension-image'
// import { IconAlignCenter, IconAlignLeft, IconAlignRight, IconCornerUpLeft, IconCornerUpRight, IconBold, IconItalic, IconLink, IconPhotoScan, IconStrikethrough, IconUnderline, IconUnlink } from '@tabler/icons-react'
// import TextAlign from '@tiptap/extension-text-align'
// import Link from '@tiptap/extension-link'
// import Imageresizer from './Imageresizer'
// import Placeholder from '@tiptap/extension-placeholder'
// import config from '@/config'

// const MenuBar = ({ editor, onImageUploadClick }) => {
//     const setLink = () => {
//         if (!editor) return
//         const previousUrl = editor.getAttributes('link').href
//         const url = window.prompt('Enter URL', previousUrl)
//         if (url === null) return
//         if (url === '') {
//             editor.chain().focus().extendMarkRange('link').unsetLink().run()
//             return
//         }
//         try {
//             editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
//         } catch {
//             alert('Invalid URL')
//         }
//     }

//     if (!editor) return null

//     return (
//         <div className='sticky top-0 bg-white rounded-t-md shadow-sm border-b border-gray-100 z-10 py-[0.5rem] min-h-[44px]'>
//             <div className='flex flex-row items-center flex-wrap justify-between max-w-3xl mx-auto'>
//                 <div className='flex flex-row flex-wrap items-center space-x-2'>
//                     <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className='px-2 py-1 rounded-md disabled:opacity-50'><IconCornerUpLeft /></button>
//                     <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className='px-2 py-1 rounded-md disabled:opacity-50'><IconCornerUpRight /></button>
//                     <div className="border-l border-gray-300 h-6" />
//                     <button onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded-md ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}><IconBold /></button>
//                     <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded-md ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}><IconItalic /></button>
//                     <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-2 py-1 rounded-md ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}><IconUnderline /></button>
//                     <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`px-2 py-1 rounded-md ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}><IconStrikethrough /></button>
//                     <div className="border-l border-gray-300 h-6" />
//                     <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`px-2 py-1 rounded-md ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}><IconAlignLeft /></button>
//                     <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`px-2 py-1 rounded-md ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}><IconAlignCenter /></button>
//                     <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`px-2 py-1 rounded-md ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}><IconAlignRight /></button>
//                     <div className="border-l border-gray-300 h-6" />
//                     <button onClick={setLink} className={`px-2 py-1 rounded-md ${editor.isActive('link') ? 'bg-gray-200' : ''}`}><IconLink /></button>
//                     <button onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} className='px-2 py-1 rounded-md'><IconUnlink /></button>
//                     <button onClick={onImageUploadClick} className='px-2 py-1 rounded-md'><IconPhotoScan /></button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// const Richtexteditor = ({
//     onChange,
//     value,
//     placeholder = 'Write something here...',
//     minEditorHeight = '250px',
//     maxEditorHeight = '350px',
//     mainContainerClass = '',
//     bodyContainerClass = ''
// }) => {
//     const fileInputRef = useRef(null)

//     const editor = useEditor({
//         extensions: [
//             Link.configure({
//                 openOnClick: false,
//                 autolink: true,
//                 defaultProtocol: 'https',
//                 protocols: ['http', 'https']
//             }),
//             StarterKit,
//             Underline,
//             Image.configure({
//                 inline: true
//             }),
//             TextAlign.configure({
//                 types: ['heading', 'paragraph']
//             }),
//             Imageresizer,
//             Placeholder.configure({ placeholder })
//         ],
//         content: value || '',
//         editorProps: {
//             attributes: {
//                 class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
//                 style: `min-height:${minEditorHeight}; max-height:${maxEditorHeight}`
//             },
//             handleDrop(view, event, slice) {
//                 const file = event.dataTransfer?.files?.[0]
//                 if (file && file.type.startsWith('image/')) {
//                     uploadImage(file)
//                     return true
//                 }
//                 return false
//             }
//         }
//     })

//     const uploadImage = async (file) => {
//         if (file.size > 1024 * 1024) {
//             alert("Image size should be less than 1MB")
//             return
//         }

//         const formData = new FormData()
//         formData.append('file', file)

//         try {
//             const res = await fetch(`${config.api_url}/diaries/diarypageimageupload`, {
//                 method: 'POST',
//                 body: formData
//             })
//             const data = await res.json()

//             if (data?.imageUrl) {
//                 editor?.chain().focus().setImage({ src: data.imageUrl }).run()
//             } else {
//                 alert("Image upload failed.")
//             }
//         } catch (err) {
//             console.error(err)
//             alert("Upload error.")
//         }
//     }

//     const handleImageUploadClick = () => {
//         fileInputRef.current?.click()
//     }

//     const handleFileChange = async (event) => {
//         const file = event.target.files?.[0]
//         if (file) {
//             await uploadImage(file)
//         }
//     }

//     const handleEditorChange = () => {
//         if (onChange) {
//             onChange(editor?.getHTML() || '')
//         }
//     }

//     useEffect(() => {
//         if (editor && value !== editor.getHTML()) {
//             editor.commands.setContent(value || '')
//         }
//     }, [value, editor])

//     useEffect(() => {
//         if (!editor) return
//         editor.on('update', handleEditorChange)
//         return () => editor.off('update', handleEditorChange)
//     }, [editor])

//     return (
//         <div className={`richtexteditor-main w-full border border-gray-300 rounded-md shadow-sm ${mainContainerClass}`}>
//             <input
//                 type="file"
//                 accept="image/*"
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 className="hidden"
//             />
//             <MenuBar
//                 editor={editor}
//                 onImageUploadClick={handleImageUploadClick}
//             />
//             <EditorContent
//                 editor={editor}
//                 className={`richtexteditor-body prose prose-sm p-4 focus:outline-none ${bodyContainerClass}`}
//                 style={{
//                     minHeight: minEditorHeight,
//                     maxHeight: maxEditorHeight,
//                     overflowX: 'hidden',
//                     overflowY: 'auto'
//                 }}
//             />
//         </div>
//     )
// }

// export { Richtexteditor }
// =======================================================================

import React, { useRef, useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import config from '@/config'
import Imageresizer from './Imageresizer'

import {
    IconAlignCenter,
    IconAlignLeft,
    IconAlignRight,
    IconCornerUpLeft,
    IconCornerUpRight,
    IconBold,
    IconItalic,
    IconLink,
    IconPhotoScan,
    IconStrikethrough,
    IconUnderline,
    IconUnlink
} from '@tabler/icons-react'
import { Modal } from '@nayeshdaggula/tailify'
import CropImage from '../CropImage'

const MenuBar = ({ editor, onImageUploadClick }) => {
    const setLink = () => {
        if (!editor) return
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('Enter URL', previousUrl)
        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        try {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
        } catch {
            alert('Invalid URL')
        }
    }

    if (!editor) return null

    return (
        <div className='sticky top-0 bg-white rounded-t-md shadow-sm border-b border-gray-100 z-10 py-[0.5rem] min-h-[44px]'>
            <div className='flex flex-row items-center flex-wrap justify-between max-w-3xl mx-auto'>
                <div className='flex flex-row flex-wrap items-center space-x-2'>
                    <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className='px-2 py-1 rounded-md disabled:opacity-50'><IconCornerUpLeft /></button>
                    <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className='px-2 py-1 rounded-md disabled:opacity-50'><IconCornerUpRight /></button>
                    <div className="border-l border-gray-300 h-6" />
                    <button onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded-md ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}><IconBold /></button>
                    <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded-md ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}><IconItalic /></button>
                    <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-2 py-1 rounded-md ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}><IconUnderline /></button>
                    <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`px-2 py-1 rounded-md ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}><IconStrikethrough /></button>
                    <div className="border-l border-gray-300 h-6" />
                    <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`px-2 py-1 rounded-md ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}><IconAlignLeft /></button>
                    <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`px-2 py-1 rounded-md ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}><IconAlignCenter /></button>
                    <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`px-2 py-1 rounded-md ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}><IconAlignRight /></button>
                    <div className="border-l border-gray-300 h-6" />
                    <button onClick={setLink} className={`px-2 py-1 rounded-md ${editor.isActive('link') ? 'bg-gray-200' : ''}`}><IconLink /></button>
                    <button onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} className='px-2 py-1 rounded-md'><IconUnlink /></button>
                    <button onClick={onImageUploadClick} className='px-2 py-1 rounded-md'><IconPhotoScan /></button>
                </div>
            </div>
        </div>
    )
}

const Richtexteditor = ({
    onChange,
    value,
    placeholder = 'Write something here...',
    minEditorHeight = '250px',
    maxEditorHeight = '350px',
    mainContainerClass = '',
    bodyContainerClass = ''
}) => {
    const fileInputRef = useRef(null)

    const [featureImageModal, setFeatureImageModal] = useState(false)
    const [featuredImageUrl, setFeaturedImageUrl] = useState("")
    const [croppedImage, setCroppedImage] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)

    const openFeatureImageModal = () => setFeatureImageModal(true)
    const closeFeatureImageModal = () => setFeatureImageModal(false)
    const editor = useEditor({
        extensions: [
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
                protocols: ['http', 'https']
            }),
            StarterKit,
            Underline,
            Image.configure({ inline: true }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Imageresizer,
            Placeholder.configure({ placeholder })
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
                style: `min-height:${minEditorHeight}; max-height:${maxEditorHeight}`
            },
            handleDrop(view, event) {
                const file = event.dataTransfer?.files?.[0]
                if (file && file.type.startsWith('image/')) {
                    openCropper(file)
                    return true
                }
                return false
            }
        }
    })

    const openCropper = (file) => {
        const reader = new FileReader()
        reader.onload = () => {
            setSelectedFile(file)
            setFeaturedImageUrl(reader.result)
            openFeatureImageModal()
        }
        reader.readAsDataURL(file)
    }

    const uploadImage = async (imageUrl) => {
        if (!imageUrl) return

        const formData = new FormData()

        try {
            // Fetch the blob from the cropped image URL
            const response = await fetch(imageUrl)
            const blob = await response.blob()

            // Create a random filename based on blob type
            const randomNum = Math.floor(Math.random() * 1000000)
            const fileExtension = blob.type.split('/')[1] || 'jpg'
            const randomFileName = `cropped-image-${randomNum}.${fileExtension}`

            // Convert blob to File
            const file = new File([blob], randomFileName, { type: blob.type })

            // Append to FormData
            formData.append('file', file)

            const res = await fetch(`${config.api_url}/diaries/diarypageimageupload`, {
                method: 'POST',
                body: formData
            })

            const data = await res.json()

            if (data?.imageUrl) {
                editor?.chain().focus().setImage({ src: data.imageUrl }).run()
            } else {
                alert('Image upload failed.')
            }
        } catch (err) {
            console.error('Upload error:', err)
            alert('Upload error.')
        }
    }

    const handleCroppedImage = async (croppedImageUrl) => {
        setCroppedImage(croppedImageUrl)
        closeFeatureImageModal()
        await uploadImage(croppedImageUrl)
    }

    const handleImageUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (event) => {
        const file = event.target.files?.[0]
        if (file) {
            openCropper(file)
        }
    }

    const handleEditorChange = () => {
        if (onChange) onChange(editor?.getHTML() || '')
    }

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '')
        }
    }, [value, editor])

    useEffect(() => {
        if (!editor) return
        editor.on('update', handleEditorChange)
        return () => editor.off('update', handleEditorChange)
    }, [editor])


    const [modalSize, setModalSize] = useState("35%");
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setModalSize("90%");
            }
            else {
                setModalSize("35%");
            }
        };

        handleResize(); // initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={`richtexteditor-main w-full border border-gray-300 rounded-md shadow-sm ${mainContainerClass}`}>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />

            <MenuBar
                editor={editor}
                onImageUploadClick={handleImageUploadClick}
            />

            <EditorContent
                placeholder={placeholder}
                editor={editor}
                className={`richtexteditor-body prose prose-sm p-4 focus:outline-none ${bodyContainerClass}`}
                style={{
                    minHeight: minEditorHeight,
                    maxHeight: maxEditorHeight,
                    overflowX: 'hidden',
                    overflowY: 'auto'
                }}
            />

            <Modal
                open={featureImageModal}
                size={modalSize}
                onClose={closeFeatureImageModal}
                withCloseButton={false}
                margin="0px"
                padding="0px"
                zIndex={999999}
            >
                {featureImageModal && (
                    <CropImage
                        image={featuredImageUrl}
                        onClose={closeFeatureImageModal}
                        setCroppedImage={handleCroppedImage}
                    />
                )}
            </Modal>
        </div>
    )
}

export { Richtexteditor }




