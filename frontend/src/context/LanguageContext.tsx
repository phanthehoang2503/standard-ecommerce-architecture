import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Language = 'vi' | 'en';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    // Nav
    'nav.search': 'Search products...',
    'nav.searchBtn': 'Search',
    'nav.go': 'Go',
    'nav.cart': 'Cart',
    'nav.shop': 'Shop',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'nav.login': 'Log In',
    // Footer
    'footer.text': 'Built with keyboard, fingers and caffeine for laying the groundwork of an e-commerce empire.',
    // Home
    'home.welcome': 'Welcome to E-Shop',
    'home.subtitle': 'Discover amazing products at unbeatable prices.',
    'home.allCategories': 'All Categories',
    'home.searchResults': 'Search Results for',
    'home.ourProducts': 'Our Products',
    'home.noProducts': 'No products found.',
    'home.addToCart': 'Add to Cart',
    'home.viewDetails': 'View Details',
    'home.viewAll': 'View All',
    'home.trending': 'Trending',
    'home.topSaleLaptops': 'Top Sale Laptops',
    'home.topSaleHeadphones': 'Top Sale Headphones',
    'home.newArrivals': 'New Arrivals',
    // Shop
    'shop.title': 'Shop All Products',
    'shop.categories': 'Categories',
    'shop.allProducts': 'Showing All Products',
    'shop.clearFilters': 'Clear all filters',
    // Cart
    'cart.title': 'Your Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continue': 'Continue Shopping',
    'cart.remove': 'Remove',
    'cart.clear': 'Clear Cart',
    'cart.summary': 'Order Summary',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.free': 'Free',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.loading': 'Loading cart...',
    // Profile
    'profile.title': 'My Account',
    'profile.edit': 'Edit Profile',
    'profile.address': 'Default Address',
    'profile.orderHistory': 'Order History',
    'profile.noOrders': 'No orders found.',
    'profile.placedOn': 'Placed on',
    'profile.view': 'View',
    'profile.loading': 'Loading profile...',
    // Product Detail
    'prod.back': 'Back to Products',
    'prod.stock': 'In Stock',
    'prod.outOfStock': 'Out of Stock',
    'prod.adding': 'Adding...',
    // Order Detail
    'order.title': 'Order',
    'order.notFound': 'Order Not Found',
    'order.back': 'Back to Profile',
    'order.items': 'Items summary',
    'order.payment': 'Payment',
    'order.fulfillment': 'Fulfillment',
    'order.qty': 'Qty',
    'order.tax': 'Tax',
    'order.shippingDetails': 'Shipping Details',
    // Login
    'login.welcomeBack': 'Welcome Back',
    'login.createAccount': 'Create Account',
    'login.enterDetails': 'Enter your details to access your account',
    'login.signUpToStart': 'Sign up to start shopping with us',
    'login.fullName': 'Full Name',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.signIn': 'Sign In',
    'login.signUp': 'Sign Up',
    'login.pleaseWait': 'Please wait...',
    'login.noAccount': 'Don\'t have an account? ',
    'login.hasAccount': 'Already have an account? ',
    'login.createOne': 'Create one',
    'login.logInHere': 'Log in',
    'login.authFailed': 'Authentication failed. Please check credentials.',
    
    // Cart Alerts
    'cart.checkoutSuccess': 'Checkout successful!',
    'cart.checkoutFail': 'Checkout failed! Please try again later.',
    
    // Product Alerts
    'prod.addedSuccess': 'Added to cart!',
    'prod.addedMock': 'Added to cart (mocked)!',
    
    // Mini Cart
    'minicart.recentItems': 'Recent Items',
    'minicart.empty': 'Your cart is empty',
    'minicart.moreItems': 'more items...',
    'minicart.viewFull': 'Click to see full details',
    
    // Profile Edit
    'profile.fullName': 'Full Name',
    'profile.dob': 'Date of Birth',
    'profile.save': 'Save',
    'profile.cancel': 'Cancel',
    'profile.updateSuccess': 'Profile updated successfully!',
    'profile.updateFail': 'Failed to update profile. Please try again.',
    'profile.paymentLabel': 'Payment: ',
    'profile.addressLabel': 'Address',
    'profile.noAddress': 'No address provided. Please add one to checkout.',
    
    // Admin Dashboard
    'admin.title': 'Admin Dashboard',
    'admin.tabProducts': 'Products Management',
    'admin.tabCategories': 'Categories',
    'admin.tabUsers': 'User Accounts',
    'admin.addProduct': '+ Add Product',
    'admin.addCategory': '+ New Category',
    'admin.loading': 'Loading...',
    'admin.thId': 'ID',
    'admin.thName': 'Name',
    'admin.thPrice': 'Price',
    'admin.thActions': 'Actions',
    'admin.thUsername': 'Username',
    'admin.thFullName': 'Full Name',
    'admin.thRoles': 'Roles',
    'admin.actionEdit': 'Edit',
    'admin.actionDelete': 'Delete',
    'admin.devNotice': 'features under development.'
  },
  vi: {
    // Nav
    'nav.search': 'Bạn cần tìm gì?',
    'nav.searchBtn': 'Tìm kiếm',
    'nav.go': 'Đi',
    'nav.cart': 'Giỏ hàng',
    'nav.shop': 'Cửa hàng',
    'nav.profile': 'Tài khoản',
    'nav.logout': 'Đăng xuất',
    'nav.login': 'Đăng Nhập',
    // Footer
    'footer.text': 'Được xây dựng với sự hỗ trợ của LLM',
    // Home
    'home.welcome': 'Chào mừng đến với E-Shop',
    'home.subtitle': 'Khám phá những sản phẩm tuyệt vời với giá cực kỳ ưu đãi.',
    'home.allCategories': 'Tất cả danh mục',
    'home.searchResults': 'Kết quả tìm kiếm cho',
    'home.ourProducts': 'Sản phẩm nổi bật',
    'home.noProducts': 'Không tìm thấy sản phẩm.',
    'home.addToCart': 'Thêm vào giỏ hàng',
    'home.viewDetails': 'Xem chi tiết',
    'home.viewAll': 'Xem tất cả',
    'home.trending': 'Xu hướng',
    'home.topSaleLaptops': 'Laptop bán chạy',
    'home.topSaleHeadphones': 'Tai nghe phổ biến',
    'home.newArrivals': 'Hàng mới về',
    // Shop
    'shop.title': 'Tất cả sản phẩm',
    'shop.categories': 'Danh mục',
    'shop.allProducts': 'Đang hiển thị tất cả',
    'shop.clearFilters': 'Xóa tất cả bộ lọc',
    // Cart
    'cart.title': 'Giỏ hàng',
    'cart.empty': 'Giỏ hàng trống',
    'cart.continue': 'Tiếp tục mua sắm',
    'cart.remove': 'Xóa',
    'cart.clear': 'Xóa tất cả',
    'cart.summary': 'Thông tin thanh toán',
    'cart.subtotal': 'Tạm tính',
    'cart.shipping': 'Phí vận chuyển',
    'cart.free': 'Miễn phí',
    'cart.total': 'Tổng cộng',
    'cart.checkout': 'Thanh toán',
    'cart.loading': 'Đang tải giỏ hàng...',
    // Profile
    'profile.title': 'Tài khoản của tôi',
    'profile.edit': 'Chỉnh sửa hồ sơ',
    'profile.address': 'Địa chỉ giao hàng',
    'profile.orderHistory': 'Lịch sử đơn hàng',
    'profile.noOrders': 'Chưa có đơn hàng nào.',
    'profile.placedOn': 'Ngày đặt',
    'profile.view': 'Xem',
    'profile.loading': 'Đang tải thông tin...',
    // Product Detail
    'prod.back': 'Quay lại danh sách',
    'prod.stock': 'Còn hàng',
    'prod.outOfStock': 'Hết hàng',
    'prod.adding': 'Đang thêm...',
    // Order Detail
    'order.title': 'Chi tiết đơn hàng',
    'order.notFound': 'Không tìm thấy đơn hàng',
    'order.back': 'Quay lại tài khoản',
    'order.items': 'Danh sách sản phẩm',
    'order.payment': 'Phương thức thanh toán',
    'order.fulfillment': 'Trạng thái',
    'order.qty': 'SL',
    'order.tax': 'Thuế VAT',
    'order.shippingDetails': 'Địa chỉ nhận hàng',
    // Login
    'login.welcomeBack': 'Chào mừng trở lại',
    'login.createAccount': 'Tạo tài khoản mới',
    'login.enterDetails': 'Nhập thông tin để truy cập tài khoản',
    'login.signUpToStart': 'Đăng ký ngay để bắt đầu mua sắm',
    'login.fullName': 'Họ và tên',
    'login.username': 'Tên đăng nhập',
    'login.password': 'Mật khẩu',
    'login.signIn': 'Đăng nhập',
    'login.signUp': 'Đăng ký',
    'login.pleaseWait': 'Vui lòng đợi...',
    'login.noAccount': 'Chưa có tài khoản? ',
    'login.hasAccount': 'Đã có tài khoản? ',
    'login.createOne': 'Tạo ngay',
    'login.logInHere': 'Đăng nhập ngay',
    'login.authFailed': 'Xác thực thất bại. Vui lòng kiểm tra lại thông tin.',
    
    // Cart Alerts
    'cart.checkoutSuccess': 'Thanh toán thành công!',
    'cart.checkoutFail': 'Thanh toán thất bại! Vui lòng thử lại sau.',
    
    // Product Alerts
    'prod.addedSuccess': 'Đã thêm vào giỏ hàng!',
    'prod.addedMock': 'Đã thêm vào giỏ hàng (giả lập)!',
    
    // Mini Cart
    'minicart.recentItems': 'Sản phẩm gần đây',
    'minicart.empty': 'Giỏ hàng của bạn đang trống',
    'minicart.moreItems': 'sản phẩm khác...',
    'minicart.viewFull': 'Nhấn để xem chi tiết',
    
    // Profile Edit
    'profile.fullName': 'Họ và tên',
    'profile.dob': 'Ngày sinh',
    'profile.save': 'Lưu',
    'profile.cancel': 'Hủy',
    'profile.updateSuccess': 'Cập nhật hồ sơ thành công!',
    'profile.updateFail': 'Cập nhật hồ sơ thất bại. Vui lòng thử lại.',
    'profile.paymentLabel': 'Thanh toán: ',
    'profile.addressLabel': 'Địa chỉ',
    'profile.noAddress': 'Chưa có địa chỉ. Vui lòng thêm địa chỉ để thanh toán.',
    
    // Admin Dashboard
    'admin.title': 'Bảng điều khiển Admin',
    'admin.tabProducts': 'Quản lý Sản phẩm',
    'admin.tabCategories': 'Danh mục',
    'admin.tabUsers': 'Tài khoản Người dùng',
    'admin.addProduct': '+ Thêm Sản phẩm',
    'admin.addCategory': '+ Thêm Danh mục',
    'admin.loading': 'Đang tải...',
    'admin.thId': 'Mã',
    'admin.thName': 'Tên',
    'admin.thPrice': 'Giá',
    'admin.thActions': 'Hành động',
    'admin.thUsername': 'Tên đăng nhập',
    'admin.thFullName': 'Họ và tên',
    'admin.thRoles': 'Vai trò',
    'admin.actionEdit': 'Sửa',
    'admin.actionDelete': 'Xóa',
    'admin.devNotice': 'Tính năng đang được phát triển.'
  }
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('vi');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  const t = (key: string) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
