declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    fbq: (...args: unknown[]) => void;
    _fbq: (...args: unknown[]) => void;
    ttq: {
      init: (pixelId: string) => void;
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

export interface AdTrackingConfig {
  metaPixelId?: string;
  googleAdsId?: string;
  tiktokPixelId?: string;
}

let config: AdTrackingConfig = {};

export function initAdTracking(adConfig: AdTrackingConfig): void {
  config = adConfig;
  
  if (typeof window === 'undefined') return;
  
  if (adConfig.metaPixelId) {
    initMetaPixel(adConfig.metaPixelId);
  }
  
  if (adConfig.googleAdsId) {
    initGoogleAds(adConfig.googleAdsId);
  }
  
  if (adConfig.tiktokPixelId) {
    initTikTok(adConfig.tiktokPixelId);
  }
}

function initMetaPixel(pixelId: string): void {
  if (typeof window === 'undefined') return;
  
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://connect.facebook.net/en_US/fbevents.js`;
  document.head.appendChild(script);
  
  window.fbq = function() {
    if (window.fbq) {
      (window.fbq as (...args: unknown[]) => void).call(window.fbq, ...arguments);
    }
  };
  
  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
}

function initGoogleAds(adsId: string): void {
  if (typeof window === 'undefined') return;
  
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', adsId);
  
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${adsId}`;
  document.head.appendChild(script);
}

function initTikTok(pixelId: string): void {
  if (typeof window === 'undefined') return;
  
  window.ttq = {
    init: (pid: string) => {
      window.ttq = window.ttq || {};
      window.ttq.init = window.ttq.init || function() {};
      window.ttq.identify = window.ttq.identify || function() {};
      window.ttq.track = window.ttq.track || function() {};
    },
    track: (event: string, data?: Record<string, unknown>) => {
      if (window.ttq) {
        window.ttq.track(event, data);
      }
    }
  };
  
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=${pixelId}`;
  document.head.appendChild(script);
  
  window.ttq.init(pixelId);
}

export function trackViewContent(productId: string, productName: string, value: number, currency: string = 'EGP'): void {
  if (typeof window === 'undefined') return;
  
  if (config.metaPixelId && window.fbq) {
    window.fbq('Track', 'ViewContent', {
      content_ids: [productId],
      content_name: productName,
      value: value,
      currency: currency,
    });
  }
  
  if (config.tiktokPixelId && window.ttq) {
    window.ttq.track('ViewContent', {
      content_id: productId,
      content_name: productName,
      value: value,
      currency: currency,
    });
  }
}

export function trackAddToCart(productId: string, productName: string, value: number, quantity: number, currency: string = 'EGP'): void {
  if (typeof window === 'undefined') return;
  
  if (config.metaPixelId && window.fbq) {
    window.fbq('Track', 'AddToCart', {
      content_ids: [productId],
      content_name: productName,
      value: value,
      currency: currency,
      num_items: quantity,
    });
  }
  
  if (config.googleAdsId && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      value: value,
      currency: currency,
      items: [{
        item_id: productId,
        item_name: productName,
        quantity: quantity,
        price: value,
      }],
    });
  }
  
  if (config.tiktokPixelId && window.ttq) {
    window.ttq.track('AddToCart', {
      content_id: productId,
      content_name: productName,
      value: value,
      quantity: quantity,
      currency: currency,
    });
  }
}

export function trackInitiateCheckout(value: number, items: { id: string; name: string; price: number; quantity: number }[], currency: string = 'EGP'): void {
  if (typeof window === 'undefined') return;
  
  if (config.metaPixelId && window.fbq) {
    window.fbq('Track', 'InitiateCheckout', {
      value: value,
      currency: currency,
      num_items: items.length,
    });
  }
  
  if (config.googleAdsId && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      value: value,
      currency: currency,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }
  
  if (config.tiktokPixelId && window.ttq) {
    window.ttq.track('InitiateCheckout', {
      value: value,
      currency: currency,
      contents: items.map(item => ({
        content_id: item.id,
        content_name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }
}

export function trackPurchase(orderId: string, value: number, items: { id: string; name: string; price: number; quantity: number }[], currency: string = 'EGP'): void {
  if (typeof window === 'undefined') return;
  
  if (config.metaPixelId && window.fbq) {
    window.fbq('Track', 'Purchase', {
      value: value,
      currency: currency,
      contents: items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        item_price: item.price,
      })),
      content_type: 'product',
    });
  }
  
  if (config.googleAdsId && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: orderId,
      value: value,
      currency: currency,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }
  
  if (config.tiktokPixelId && window.ttq) {
    window.ttq.track('PlaceAnOrder', {
      value: value,
      currency: currency,
      contents: items.map(item => ({
        content_id: item.id,
        content_name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }
}

export function trackLead(value: number, currency: string = 'EGP'): void {
  if (typeof window === 'undefined') return;
  
  if (config.metaPixelId && window.fbq) {
    window.fbq('Track', 'Lead', {
      value: value,
      currency: currency,
    });
  }
  
  if (config.googleAdsId && window.gtag) {
    window.gtag('event', 'generate_lead', {
      value: value,
      currency: currency,
    });
  }
  
  if (config.tiktokPixelId && window.ttq) {
    window.ttq.track('CompletePayment');
  }
}

export function trackContact(): void {
  if (typeof window === 'undefined') return;
  
  if (config.metaPixelId && window.fbq) {
    window.fbq('Track', 'Contact');
  }
  
  if (config.googleAdsId && window.gtag) {
    window.gtag('event', 'contact');
  }
}

export function trackSignUp(method: string = 'email'): void {
  if (typeof window === 'undefined') return;
  
  if (config.metaPixelId && window.fbq) {
    window.fbq('Track', 'CompleteRegistration', {
      status: 'registered',
      method: method,
    });
  }
  
  if (config.tiktokPixelId && window.ttq) {
    window.ttq.track('SignUp');
  }
}

export function trackSearch(searchTerm: string): void {
  if (typeof window === 'undefined') return;
  
  if (config.metaPixelId && window.fbq) {
    window.fbq('Track', 'Search', {
      search_string: searchTerm,
    });
  }
  
  if (config.tiktokPixelId && window.ttq) {
    window.ttq.track('Search', {
      search_string: searchTerm,
    });
  }
}
