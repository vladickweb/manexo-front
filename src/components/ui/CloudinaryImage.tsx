import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";

interface CloudinaryImageProps {
  publicId: string;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

const cld = new Cloudinary({
  cloud: {
    cloudName: "manexo",
  },
});

export const CloudinaryImage = ({
  publicId,
  width = 500,
  height = 500,
  className = "",
  alt = "",
}: CloudinaryImageProps) => {
  const img = cld
    .image(publicId)
    .format("auto")
    .quality("auto")
    .resize(fill().width(width).height(height));

  return <AdvancedImage cldImg={img} className={className} alt={alt} />;
};
