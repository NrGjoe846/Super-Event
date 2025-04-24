import { useState } from 'react';
import { 
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton
} from 'react-share';

interface ShareOptions {
  title: string;
  description: string;
  image?: string;
}

export const useShare = (url: string, options: ShareOptions) => {
  const [isSharing, setIsSharing] = useState(false);

  const share = async (platform: 'facebook' | 'twitter' | 'whatsapp' | 'email') => {
    setIsSharing(true);
    try {
      switch (platform) {
        case 'facebook':
          FacebookShareButton.share({
            url,
            quote: options.description,
          });
          break;
        case 'twitter':
          TwitterShareButton.share({
            url,
            title: options.title,
          });
          break;
        case 'whatsapp':
          WhatsappShareButton.share({
            url,
            title: options.title,
          });
          break;
        case 'email':
          EmailShareButton.share({
            url,
            subject: options.title,
            body: options.description,
          });
          break;
      }
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return {
    share,
    isSharing,
  };
};
