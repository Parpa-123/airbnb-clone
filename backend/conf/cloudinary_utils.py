import logging
import os

logger = logging.getLogger(__name__)

def delete_cloudinary_asset(image_field_or_url):
    """
    Safely deletes an asset from Cloudinary storage if configured.
    Accepts a CloudinaryResource object, an ImageFieldFile, or a URL string.
    """
    if not image_field_or_url:
        return

    try:
        import cloudinary.uploader
        
        public_id = None
        
        # 1. Check if the object has a public_id attribute (CloudinaryResource)
        if hasattr(image_field_or_url, 'public_id') and image_field_or_url.public_id:
            public_id = str(image_field_or_url.public_id)
        elif isinstance(image_field_or_url, str):
            # 2. Extract public_id from Cloudinary URL
            if 'cloudinary.com' in image_field_or_url:
                parts = image_field_or_url.split('/upload/')
                if len(parts) > 1:
                    path_after_upload = parts[1]
                    segments = path_after_upload.split('/')
                    # Ignore Cloudinary transformation parameters / version (e.g. v1234567)
                    valid_segments = []
                    for seg in segments:
                        if seg.startswith('v') and seg[1:].isdigit():
                            continue
                        if '=' in seg or ',' in seg:
                            continue  # skip transformation params like c_fill,w_300
                        valid_segments.append(seg)
                    
                    file_with_ext = '/'.join(valid_segments)
                    public_id = os.path.splitext(file_with_ext)[0]
            else:
                # Direct public_id string without URL prefix
                public_id = os.path.splitext(image_field_or_url)[0]

        if public_id:
            res = cloudinary.uploader.destroy(public_id)
            logger.info(f"Cloudinary asset destroyed: {public_id} (result: {res})")
            return res
    except Exception as e:
        logger.warning(f"Could not delete Cloudinary asset ({image_field_or_url}): {e}")
        return None
