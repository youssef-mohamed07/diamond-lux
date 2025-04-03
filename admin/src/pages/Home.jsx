import { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import { homeService } from '../services/homeService'

export default function Home() {
    const [homeData, setHomeData] = useState({
        title: '',
        subTitle: '',
        buttonText: '',
    })
    const [images, setImages] = useState([]) // Current images
    const [newImages, setNewImages] = useState([]) // New images to upload
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchHomeData()
    }, [])

    const fetchHomeData = async () => {
        try {
            setIsLoading(true)
            const { home } = await homeService.getHomeData()
            if (home) {
                setHomeData({
                    id: home._id,
                    title: home.Title || '',
                    subTitle: home.subTitle || '',
                    buttonText: home.buttonText || '',
                })
                setImages(home.imagesCover || [])
            } else {
                // Handle case when no home data exists
                setHomeData({
                    id: null,
                    title: '',
                    subTitle: '',
                    buttonText: '',
                })
                setImages([])
            }
        } catch (error) {
            toast.error('Failed to fetch home data')
            // Set default empty state
            setHomeData({
                id: null,
                title: '',
                subTitle: '',
                buttonText: '',
            })
            setImages([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setHomeData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (index, file) => {
        if (file) {
            const updatedImages = [...newImages]
            updatedImages[index] = file
            setNewImages(updatedImages)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            const formData = new FormData()
            
            // Add text fields
            formData.append('Title', homeData.title)
            formData.append('subTitle', homeData.subTitle)
            formData.append('buttonText', homeData.buttonText)
            
            // Add images
            newImages.forEach((image, index) => {
                if (image) {
                    formData.append('imagesCover', image)
                    formData.append('imagePositions', index)
                }
            })

            if (homeData.id) {
                // Update existing home data
                await homeService.updateHomeData(homeData.id, formData)
                toast.success('Home data updated successfully')
            } else {
                // Create new home data
                await homeService.createHomeData(formData)
                toast.success('Home data created successfully')
            }
            
            setNewImages([])
            fetchHomeData()
        } catch (error) {
            toast.error(homeData.id ? 'Failed to update home data' : 'Failed to create home data')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) return <div>Loading...</div>

    return (
        <form onSubmit={handleSubmit} className="p-4 md:p-6 w-full max-w-2xl mx-auto">
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg md:text-xl font-bold mb-4">Hero Section Settings</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2 text-sm md:text-base">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={homeData.title}
                                onChange={handleInputChange}
                                className="w-full p-2 md:p-3 border rounded text-sm md:text-base"
                            />
                        </div>
                        
                        <div>
                            <label className="block mb-2 text-sm md:text-base">Subtitle</label>
                            <input
                                type="text"
                                name="subTitle"
                                value={homeData.subTitle}
                                onChange={handleInputChange}
                                className="w-full p-2 md:p-3 border rounded text-sm md:text-base"
                            />
                        </div>
                        
                        <div>
                            <label className="block mb-2 text-sm md:text-base">Button Text</label>
                            <input
                                type="text"
                                name="buttonText"
                                value={homeData.buttonText}
                                onChange={handleInputChange}
                                className="w-full p-2 md:p-3 border rounded text-sm md:text-base"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-sm md:text-base">Hero Section Images</p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 md:gap-4">
                        {[...Array(5)].map((_, index) => (
                            <label key={index} htmlFor={`image${index}`} className="cursor-pointer">
                                <img
                                    className="w-16 h-16 md:w-24 md:h-24 object-cover border rounded"
                                    src={
                                        newImages[index]
                                            ? URL.createObjectURL(newImages[index])
                                            : images[index] || assets.upload_area
                                    }
                                    alt={`Hero ${index + 1}`}
                                />
                                <input
                                    type="file"
                                    id={`image${index}`}
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto mt-4 px-4 py-2 md:px-6 md:py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 text-sm md:text-base"
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    )
}
