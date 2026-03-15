import communityReviews from '~/data/community-reviews.json'

export default {
  site: {
    name: "Workflow Coworking Space",
    tagline: "Your best work gets done here.",
    description: "The first ever coworking space and study hub in Ozamiz City and Misamis Occidental"
  },
  hero: {
    backgroundImage: "/images/heropic.png",
    backgroundImageAlt: "Workflow Coworking Space interior",
    subtitle: "Workflow Coworking Space",
    title: "Your best work gets done",
    titleHighlight: "here",
    description: "The first ever coworking space and study hub in Ozamiz City and Misamis Occidental",
    textColor: "#1a1a1a",
    titleHighlightColor: "#3AFF86",
    primaryButtonColor: "#69AC7C",
    primaryButtonStyle: "solid",
    primaryGradientColor1: "#69AC7C",
    primaryGradientColor2: "#5a9a6e",
    primaryGradientDirection: "to right",
    primaryButtonTextColor: "#ffffff",
    secondaryButtonColor: "#7B7557",
    secondaryButtonStyle: "solid",
    secondaryGradientColor1: "#7B7557",
    secondaryGradientColor2: "#605B45",
    secondaryGradientDirection: "to right",
    secondaryButtonTextColor: "#7B7557",
    buttons: [
      { text: "ORDER NOW", type: "primary", action: "order" },
      { text: "BOOK OUR SPACE", type: "secondary", action: "book" }
    ]
  },
  about: {
    title: "About us",
    paragraphs: [
      "Made by the passionate, for the passionate.",
      "Workflow Coworking Space is the first ever hub in the heart of Ozamiz City and Misamis Occidental, designed to inspire productivity and collaboration.",
      "We provide a welcoming space for freelancers, students, and entrepreneurs to work, connect, and grow together."
    ],
    image: "/images/about.jpeg",
    imageAlt: "Workflow Coworking Space - people working together",
    overlayText: "workflow coworking",
    button: { text: "LEARN MORE", action: "learn-more" },
    titleFontFamily: "Poppins",
    textFontFamily: "Poppins",
    titleColor: "#7B7557",
    textColor: "#1E1E1E",
    buttonFontFamily: "Poppins",
    buttonStyle: "solid",
    buttonColor: "#7B7557",
    buttonGradientColor1: "#7B7557",
    buttonGradientColor2: "#605B45",
    buttonGradientDirection: "to right",
    buttonTextColor: "#ffffff",
    buttonHoverColor: "#605B45"
  },
  communitySays: communityReviews,
  features: [
    { name: "High Speed Internet", icon: "wifi" },
    { name: "Power Outlets", icon: "outlet" },
    { name: "Air Conditioned", icon: "ac" },
    { name: "Ergonomic Chairs", icon: "chair" }
  ],
  ourSpace: {
    title: "Our Space",
    titleFontFamily: "Poppins",
    titleColor: "#69AC7C",
    description: "Designed to inspire productivity and creativity, our space welcomes students, freelancers, and entrepreneurs looking for a comfortable place to work or unwind. Enjoy coffee, matcha, milk-based drinks, rice meals, and snacks. Order, settle in, and make the space your own. Need something bigger? Book the entire venue for events and special gatherings.",
    textFontFamily: "Poppins",
    textColor: "#374151",
    button: { text: "RATES", action: "rates" },
    buttonFontFamily: "Poppins",
    buttonStyle: "solid",
    buttonColor: "#69AC7C",
    buttonGradientColor1: "#69AC7C",
    buttonGradientColor2: "#5a9a6e",
    buttonGradientDirection: "to right",
    buttonTextColor: "#ffffff",
    buttonHoverColor: "#5a9a6e",
    galleryButton: { text: "View full gallery" },
    galleryPageSubtitle: "Explore our space with more photos from our coworking and study hub.",
    images: [
      "/images/space-1.jpg", "/images/space-2.jpg", "/images/space-3.jpg", "/images/space-4.jpg",
      "/images/space-5.jpg", "/images/space-6.jpg", "/images/space-7.jpg", "/images/space-8.jpg"
    ],
    carousel: { itemsPerGroup: 4, autoSlideInterval: 5000 }
  },
  navigation: {
    logo: { image: "/images/logo.png" },
    links: [
      { text: "Home", to: "/" },
      { text: "Announcements", to: "/announcements" },
      { text: "Menu", to: "/menu" },
      { text: "Our Space", to: "/venues/1" },
      { text: "About", to: "/about" }
    ],
    contactButton: { text: "Contact Us", to: "/contact" }
  },
  serviceFeatures: [
    { name: "MADE-TO-ORDER", icon: "chef" },
    { name: "CONVENIENT ORDERING", icon: "basket" },
    { name: "FUEL FOR GREAT IDEAS", icon: "lightbulb" }
  ],
  bestSellingItems: {
    title: { prefix: "Our", highlight: "Best-Selling", suffix: "Items" },
    titleFontFamily: "Poppins",
    titleColor: "#1a1a1a",
    titleHighlightColor: "#3AFF86",
    description: "Our best-selling items are loved for their rich flavors and satisfying quality. From creamy coffee favorites to hearty, flavorful food, each product is crafted to deliver comfort and enjoyment making them the top choices our customers keep coming back for.",
    items: [
      { name: "Signature Matcha Latte" },
      { name: "Ube Spanish Latte" },
      { name: "Dirty Matcha Latte" },
      { name: "Caramel Macchiato" }
    ],
    viewMenuButton: { text: "Fuel your focus", action: "view-menu" },
    descriptionFontFamily: "Poppins",
    descriptionColor: "#374151",
    buttonFontFamily: "Poppins",
    buttonStyle: "solid",
    buttonColor: "#7B7557",
    buttonGradientColor1: "#7B7557",
    buttonGradientColor2: "#605B45",
    buttonGradientDirection: "to right",
    buttonTextColor: "#ffffff",
    buttonHoverColor: "#605B45",
  },
  announcements: {
    title: "Announcements",
    items: [
      { id: "cloud-series", title: "Signature CLOUD SERIES", image: "/images/m1.jpg", description: "Try our new Cloud Series drinks—fluffy, dreamy, and perfect for any moment.", date: "2025-02-20" },
      { id: "brain-booster", title: "Brain Booster", image: "/images/m2.jpg", description: "Fuel your focus with our Brain Booster lineup. Stay sharp and productive.", date: "2025-02-18" },
      { id: "coffee-shop", title: "Coffee Shop Setup", image: "/images/m3.jpg", description: "We've upgraded our coffee setup for a better brew every time.", date: "2025-02-15" },
      { id: "savory-selections", title: "Savory Selections", image: "/images/m4.jpg", description: "New savory items now on the menu. Hearty and satisfying.", date: "2025-02-10" },
      { id: "anniversary", title: "2ND ANNIVERSARY CELEBRATION", image: "/images/m5.jpg", description: "Celebrate two years with us! Join the party and enjoy special offers.", date: "2025-02-01" }
    ]
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      { id: "outside-food", question: "Can I bring my own food or drinks?", answer: "We kindly ask that no outside food or drinks be brought into Workflow. Enjoy our selection of fresh drinks, rice meals, and snacks while you work or study!" },
      { id: "book-space", question: "Can I book the space for events or seminars?", answer: "Absolutely! You can rent the entire space for events, workshops, or seminars. Contact us to check availability and rates." },
      { id: "sign-in", question: "Do I need to sign in to order drinks or meals?", answer: "No sign-in is required! You can order as a guest and pay at the counter, and pick up your order which is simple, fast, and convenient." }
    ]
  },
  newsletter: {
    title: "Stay in the loop",
    description: "Get updates on new drinks, events, and promos. No spam—just the good stuff.",
    emailPlaceholder: "Your email address",
    buttonText: "Subscribe"
  },
  contact: {
    title: "Contact Us",
    form: {
      firstName: { label: "Firstname", placeholder: "Firstname" },
      lastName: { label: "Lastname", placeholder: "Lastname" },
      email: { label: "Your email address", placeholder: "Your email address" },
      phone: { label: "Contact Number", placeholder: "Contact Number" },
      subject: { label: "Subject", placeholder: "Subject" },
      message: { label: "Your message", placeholder: "Your message" }
    },
    map: {
      title: "Find us here",
      embedUrl: "https://www.google.com/maps?q=555+Don+Anselmo+Bernad+Avenue,+Ozamiz,+Misamis+Occidental,+Workflow+co-working+space+mercury+dug+building&output=embed",
      location: "555 Don Anselmo Bernad Avenue, Ozamiz, Misamis Occidental",
      placeName: "Workflow co-working space in mercury dug building"
    },
    buildingImage: "/images/locationwork.jpg",
    backgroundImage: "/images/contact-bg.jpg"
  },
  footer: {
    logo: { image: "/images/logo.png", text: "WORKFLOW COWORKING SPACE", tagline: "Your Coworking Space and Cafe in Ozamiz City and Misamis Occidental" },
    sitemap: {
      title: "Sitemap",
      links: [
        { text: "Home", to: "/" },
        { text: "Announcements", to: "/announcements" },
        { text: "Menu", to: "/menu" },
        { text: "Our Space", to: "/venues/1" },
        { text: "About", to: "/about" },
        { text: "Login", to: "/login" }
      ]
    },
    location: { title: "Location", address: "Workflow Coworking Space\n2nd Floor, Infinity Business Center\nBernad Avenue, Aguada\nOzamiz City 7200\nMisamis Occidental, Philippines" },
    socialLinks: {
      facebook: "https://www.facebook.com/workflowcoworkingspace",
      instagram: "https://www.instagram.com/workflow.coworking/",
      email: "workflowcoworkingspace@gmail.com"
    },
    businessHours: { title: "Business Hours", hours: ["Monday to Saturday", "8:00 am to 10:00 pm"] },
    poweredBy: "Powered by Tech Savvy"
  },
  colors: { primary: "#7B7557", primaryHover: "#605B45", workflowGreen: "#69AC7C", workflowGreenHover: "#5E5A45" }
}
