export default function ImageGrid({ images }){
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {images.map((src,i)=> <img key={i} src={src} alt="gallery" className="w-full h-40 object-cover rounded" />)}
      </div>
    );
  }