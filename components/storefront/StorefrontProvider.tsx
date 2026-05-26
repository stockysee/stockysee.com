"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";

// ── SANITIZE SECTIONS HELPER ──
// FIX: Ensure header always has full-width in storefront
const sanitizeStorefrontSections = (secs: any[]): any[] => {
  if (!secs || secs.length === 0) return secs;
  
  return secs.map(section => {
    // Normalize header to always be 'global-header' with contentWidth: 'full'
    // Check both uppercase HEADER and different variations
    if (section.type === 'HEADER' || section.type?.toUpperCase() === 'HEADER' || section.id === 'global-header' || section.id?.includes('header')) {
      const sanitized = {
        ...section,
        id: 'global-header',
        type: 'HEADER', // Ensure type is uppercase
        config: {
          ...section.config,
          contentWidth: 'full' // Force header to full-width
        }
      };
      console.log("[StorefrontProvider DEBUG] Sanitized HEADER section:", {
        originalId: section.id,
        originalType: section.type,
        newId: sanitized.id,
        contentWidth: sanitized.config.contentWidth
      });
      return sanitized;
    }
    return section;
  });
};

// ... (rest of the interfaces)

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface StorefrontContextType {
  client: any;
  products: any[];
  categories: any[];
  sections: any[];
  customPages: any[];
  hasAbout: boolean;
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  selectedProduct: any;
  setSelectedProduct: (product: any) => void;
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;
  lightboxOpen: boolean;
  setLightboxOpen: (open: boolean) => void;
  formatRupiah: (amount: number) => string;
}

const StorefrontContext = createContext<StorefrontContextType | undefined>(undefined);

export function StorefrontProvider({ 
  children, 
  client, 
  products,
  categories,
  sections,
  customPages
}: { 
  children: React.ReactNode; 
  client: any; 
  products: any[];
  categories?: any[];
  sections?: any[];
  customPages?: any[];
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    console.log("[StorefrontProvider Debug] isMobileMenuOpen state changed:", isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  const hasAbout = (sections || client?.sections || []).some((s: any) => 
    s.type?.toUpperCase() === "TEXT" && s.isActive !== false
  );

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedProduct]);

  useEffect(() => {
    console.log("[StorefrontProvider] Rendered successfully. Client slug:", client?.slug, "Has client data:", !!client);
  }, [client]);

  // Persistent Cart Logic
  useEffect(() => {
    if (!client?.slug) return;
    const savedCart = localStorage.getItem(`cart_${client.slug}`);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  }, [client?.slug]);

  useEffect(() => {
    if (!client?.slug) return;
    if (cart.length > 0 || localStorage.getItem(`cart_${client.slug}`)) {
      localStorage.setItem(`cart_${client.slug}`, JSON.stringify(cart));
    }
  }, [cart, client?.slug]);

  const addToCart = (product: any) => {
    const sellingPrice = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: sellingPrice, 
        quantity: 1,
        image: product.images?.[0] || null
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace("Rp", "Rp ");
  };

  // Extract unique font families used across all sections to load them dynamically
  const activeFonts = React.useMemo(() => {
    const fonts = new Set<string>();
    const allSections = sections || client?.sections || [];

    const extractFromElements = (elements: any[]) => {
      if (!elements || !Array.isArray(elements)) return;
      elements.forEach(el => {
        if (el.config) {
          Object.keys(el.config).forEach(key => {
            if (key.toLowerCase().includes('fontfamily') && el.config[key]) {
              fonts.add(el.config[key]);
            }
          });
        }
        if (el.children) {
          extractFromElements(el.children);
        }
      });
    };

    allSections.forEach((sec: any) => {
      const secElements = sec.elements || sec.config?.elements || [];
      if (secElements.length > 0) {
        extractFromElements(secElements);
      }
    });

    const fontList = Array.from(fonts);
    if (fontList.length > 0) {
      console.log("[DEBUG] Active fonts loaded dynamically in storefront:", fontList);
    }
    return fontList;
  }, [sections, client?.sections]);

  const resolvedSections = (sections && sections.length > 0) ? sections : (client?.sections || []);
  
  // FIX: Apply section sanitization to ensure header has contentWidth: 'full'
  const sanitizedSections = sanitizeStorefrontSections(resolvedSections);

  return (
    <StorefrontContext.Provider value={{ 
      client, 
      products, 
      categories: categories || [],
      sections: sanitizedSections,
      customPages: customPages || [],
      hasAbout,
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen,
      isMobileMenuOpen,
      setIsMobileMenuOpen,
      selectedProduct,
      setSelectedProduct,
      activeImageIndex,
      setActiveImageIndex,
      lightboxOpen,
      setLightboxOpen,
      formatRupiah
    }}>
      {/* Dynamic Google Fonts Stylesheet Loader */}
      {activeFonts.map((font: string) => {
        const safeFonts = ['Arial', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Times New Roman', 'Georgia', 'Garamond', 'Courier New', 'inherit'];
        if (safeFonts.includes(font)) return null;
        const formattedFont = font.replace(/\s+/g, '+');
        return (
          <link
            key={font}
            href={`https://fonts.googleapis.com/css2?family=${formattedFont}:wght@300;400;500;600;700;800;900&display=swap`}
            rel="stylesheet"
          />
        );
      })}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </StorefrontContext.Provider>
  );
}

export function useStorefront() {
  const context = useContext(StorefrontContext);
  if (context === undefined) {
    throw new Error("useStorefront must be used within a StorefrontProvider");
  }
  return context;
}
