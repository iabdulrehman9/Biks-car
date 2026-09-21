import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'ja';

export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.collection': 'Collection',
    'nav.about': 'About Us',
    'nav.contact': 'Contact Us',
    'nav.message': 'Message',
    'nav.sell': 'Sell',
    'nav.sellWithUs': 'Sell With Us',
    'nav.admin': 'Admin',

    // Red Banner Slider (Between Navbar & Hero)
    'banner.badge1': 'OFFICIAL EXPORTER',
    'banner.title1': 'WELCOME TO BIKS TRADING COMPANY',
    'banner.subtitle1': 'Direct Japanese Heavy Machinery, Trucks & Vehicles Exporter',
    'banner.tag1': 'Verified Quality',
    'banner.badge2': 'WORLDWIDE LOGISTICS',
    'banner.title2': 'HEAVY DUTY LOGISTICS & CARGO EXPRESS',
    'banner.subtitle2': 'Fast, Insured Port-to-Port Ro-Ro & Container Shipping Worldwide',
    'banner.tag2': 'Fast Transit',
    'banner.badge3': 'AUCTION ACCESS',
    'banner.title3': 'DIRECT AUCTION ACCESS & MACHINERY SOURCING',
    'banner.subtitle3': 'Tokyo, Yokohama & Nagoya Auctions Daily with Certified Inspection',
    'banner.tag3': 'Certified Inspection',
    'banner.ctaCollection': 'Explore Collection',
    'banner.ctaShipping': 'Shipping Info',
    'banner.ctaContact': 'Contact Us',

    // Home Hero
    'home.heroBadge': 'BIKS TRADING COMPANY',
    'home.heroTitle': 'Quality Japanese Vehicles.',
    'home.viewVehicle': 'View Vehicle',
    'home.browseVehicles': 'Browse Vehicles',

    // Home - Featured Vehicles Showcase
    'home.showcaseEyebrow': 'Featured Collection',
    'home.showcaseTitle': 'Featured Vehicles',
    'home.seeAllCollections': 'See All Collections',
    'home.noVehiclesTitle': 'No Featured Vehicles Right Now',
    'home.noVehiclesDesc': 'Explore our full collection to view all available vehicles, heavy machinery, and parts.',

    // Home - Why Choose BIKS (Restored + 'Buying and Selling a Vehicle')
    'home.whyEyebrow': 'Why Choose BIKS',
    'home.whyHeading1': 'More Than Just',
    'home.whyHeading2': 'Buying and Selling a Vehicle.',
    'home.whyHeading3': 'A Complete Trading Experience.',
    'home.whyDesc': 'From Japanese auction sourcing to professional inspection, transparent pricing and international shipping, we manage every important step with precision and confidence.',
    'home.whyTrustLabel': 'Your trusted partner in Japanese vehicle exports',

    // Home - Final CTA (Strictly 'BIKS Trading Company', no 'Car')
    'home.ctaHeading': 'Find Your Next Japanese Vehicle With',
    'home.ctaCompany': 'BIKS Trading Company.',
    'home.ctaDesc': "Tell us what you're looking for and our team will help you find the right vehicle, calculate your landed cost, and arrange the export.",
    'home.ctaButton': 'Contact Us',
    'home.ctaTrust1': 'Japanese Auction Sourcing',
    'home.ctaTrust2': 'Worldwide Export',
    'home.ctaTrust3': 'Transparent Pricing',

    // About Page (Restored from older version)
    'about.badge': 'BIKS TRADING COMPANY',
    'about.heroTitle1': 'Quality Japanese Vehicles.',
    'about.heroTitle2': 'Global Export Service.',
    'about.heroDesc': 'BIKS connects international buyers with premium Japanese vehicles through transparent trading, rigorous inspections, and end-to-end export support.',
    'about.browseVehicles': 'Browse Vehicles',
    'about.contactUs': 'Contact Us',
    'about.trustPricing': 'Transparent Pricing',
    'about.trustInspections': 'Verified Inspections',

    'about.foundationEyebrow': 'Our Foundation',
    'about.foundationTitle': 'What Sets BIKS Apart',
    'about.foundationSubtitle': 'Our core principles define every vehicle transaction and client partnership.',
    'about.val1Title': 'Trust & Transparency',
    'about.val1Desc': 'Every transaction is fully documented with upfront pricing. No hidden fees, unexpected costs, or surprises along the way.',
    'about.val2Title': 'Quality First',
    'about.val2Desc': 'A rigorous multi-point inspection process ensures only verified, high-condition vehicles reach our global clients.',
    'about.val3Title': 'Client Focused',
    'about.val3Desc': 'Dedicated account managers provide personalized guidance and support throughout the entire purchasing and shipping process.',

    'about.historyEyebrow': 'Our History',
    'about.historyTitle': 'Milestones & Proven Track Record',
    'about.historySubtitle': 'Growing from a local Yokohama exporter to a trusted global partner.',
    'about.milestone1Year': '2016',
    'about.milestone1Title': 'Founded in Yokohama',
    'about.milestone1Desc': 'BIKS established as a premium Japanese vehicle export trading company.',

    'about.ctaTitle': 'Ready to Build Your',
    'about.ctaTitleHighlight': 'Fleet Together?',
    'about.ctaDesc': 'Whether you need a single vehicle or full container shipping, BIKS delivers end-to-end expertise.',
    'about.ctaButton': 'Get Started Now',
    'about.ctaTrust1': 'Japanese Quality',
    'about.ctaTrust2': 'Global Export',
    'about.ctaTrust3': 'Transparent Service',

    // Collection Page
    'collection.title': 'Vehicle & Equipment Collection',
    'collection.subtitle': 'Browse our comprehensive inventory of verified Japanese vehicles, heavy machinery, and parts.',
    'collection.searchPlaceholder': 'Search by make, model, chassis...',
    'collection.filters': 'Filters',
    'collection.category': 'Category',
    'collection.allCategories': 'All Categories',
    'collection.make': 'Make / Brand',
    'collection.priceRange': 'Price Range (FOB USD)',
    'collection.year': 'Year',
    'collection.transmission': 'Transmission',
    'collection.fuel': 'Fuel Type',
    'collection.status': 'Status',
    'collection.clearAll': 'Clear All Filters',
    'collection.noResults': 'No vehicles or equipment found matching your criteria.',
    'collection.tryClearing': 'Try clearing some filters or searching with different keywords.',
    'collection.showing': 'Showing',
    'collection.vehiclesCount': 'vehicles & equipment',
    'collection.sortNewest': 'Newest First',
    'collection.sortPriceAsc': 'Price: Low to High',
    'collection.sortPriceDesc': 'Price: High to Low',
    'collection.sortYearDesc': 'Year: Newest',
    'collection.sortMileageAsc': 'Mileage: Lowest',

    // Categories
    'cat.Trucks': 'Trucks',
    'cat.Cars': 'Cars',
    'cat.Tyre Shover': 'Tyre Shover',
    'cat.Forklifts': 'Forklifts',
    'cat.Agricultural Machines': 'Agricultural Machines',
    'cat.Truck Fixtures': 'Truck Fixtures',
    'cat.Other Parts': 'Other Parts',

    // Vehicle Details
    'details.backToInventory': 'Back to Collection',
    'details.specifications': 'Specifications',
    'details.make': 'Make',
    'details.model': 'Model',
    'details.year': 'Year',
    'details.category': 'Category',
    'details.bodyType': 'Body Type',
    'details.engineSize': 'Engine Size',
    'details.fuelType': 'Fuel Type',
    'details.transmission': 'Transmission',
    'details.mileage': 'Mileage',
    'details.color': 'Color',
    'details.chassisNumber': 'Chassis Number',
    'details.location': 'Location',
    'details.features': 'Features & Equipment',
    'details.inquireNow': 'Inquire About This Vehicle',
    'details.callUs': 'Call Us Directly',
    'details.priceFob': 'FOB Price',
    'details.status': 'Status',

    // Footer (Strictly BIKS Trading Company, never Car)
    'footer.about': 'BIKS Trading Company is a trusted Japanese vehicle exporter, supplying high-quality used vehicles worldwide with reliable inspection, shipping, and export services.',
    'footer.company': 'Company',
    'footer.categories': 'Categories',
    'footer.contact': 'Contact Us',
    'footer.contactInfo': 'Contact Information',
    'footer.addressLine1': '1315-15 Morokawa,',
    'footer.addressLine2': 'Koga, Ibaraki 306-0126,',
    'footer.addressLine3': 'Japan',
    'footer.rights': 'All rights reserved.',
    'footer.lineConnect': 'Connect on LINE',
    'footer.lineScan': 'Scan or Click to Chat',

    // Admin Dashboard
    'admin.dashboard': 'Inventory Management',
    'admin.totalVehicles': 'Total Inventory',
    'admin.availableVehicles': 'Available',
    'admin.reservedVehicles': 'Reserved',
    'admin.soldVehicles': 'Sold',
    'admin.addNewVehicle': 'Add Vehicle',
    'admin.manageCategories': 'Categories',
    'admin.searchPlaceholder': 'Search inventory...',
    'admin.allCategories': 'All Categories',
    'admin.allStatuses': 'All Statuses',
    'admin.photo': 'Photo',
    'admin.vehicle': 'Vehicle',
    'admin.year': 'Year',
    'admin.category': 'Category',
    'admin.price': 'Price (FOB)',
    'admin.status': 'Status',
    'admin.actions': 'Actions',
    'admin.edit': 'Edit',
    'admin.delete': 'Delete',
    'admin.noVehiclesFound': 'No inventory items match your search.',
    'admin.confirmDelete': 'Are you sure you want to delete this vehicle?',
    'admin.deleteFailed': 'Failed to delete vehicle',
    'admin.logout': 'Sign Out',
    'admin.accountSettings': 'Account Settings',

    // Vehicle Form Modal
    'form.addTitle': 'Add New Vehicle',
    'form.editTitle': 'Edit Vehicle',
    'form.make': 'Make / Manufacturer',
    'form.model': 'Model Name',
    'form.year': 'Manufacturing Year',
    'form.category': 'Category',
    'form.newCategory': '+ Add New Category',
    'form.bodyType': 'Body Type',
    'form.transmission': 'Transmission',
    'form.fuelType': 'Fuel Type',
    'form.engineCc': 'Engine CC',
    'form.mileage': 'Mileage (km)',
    'form.color': 'Exterior Color',
    'form.priceJpy': 'Price FOB (JPY)',
    'form.priceUsd': 'Price FOB (USD)',
    'form.status': 'Inventory Status',
    'form.location': 'Physical Location',
    'form.chassis': 'Chassis Number',
    'form.mainImage': 'Main Photo (WebP Optimized)',
    'form.galleryImages': 'Gallery Photos (Up to 20)',
    'form.features': 'Equipment / Special Features',
    'form.featured': 'Featured Vehicle',
    'form.addCategory': '+ Add New Category',
    'form.save': 'Save Vehicle',
    'form.updating': 'Updating...',
    'form.creating': 'Creating...',
    'form.cancel': 'Cancel',

    // Admin Login (Generic Placeholders)
    'login.title': 'Admin Login',
    'login.subtitle': 'Sign in to manage your export inventory and settings',
    'login.email': 'Email Address',
    'login.emailPlaceholder': 'Enter email address',
    'login.password': 'Password',
    'login.passwordPlaceholder': 'Enter password',
    'login.submit': 'Sign In',
    'login.submitting': 'Signing In...',
    'login.back': 'Back to Home',

    // Status
    'status.Available': 'Available',
    'status.Reserved': 'Reserved',
    'status.Sold': 'Sold',
    'status.In Transit': 'In Transit',
    'status.Delivered': 'Delivered',

    // Sell Page
    'sell.badge': 'BIKS Machinery & Vehicle Consignment',
    'sell.title': 'Sell Your Equipment, Trucks & Cars With BIKS',
    'sell.subtitle': 'Connect directly with our global export network. Submit your machinery, trucks, cars, or equipment details below — our valuation team will review and contact you promptly with the best market offer.',
    'sell.stat1': 'Best Market Value',
    'sell.stat2': 'Global Buyers',
    'sell.stat3': '24h Fast Response',
    'sell.stat4': 'Zero Hassle Export',
    'sell.step1Title': 'Submit Details',
    'sell.step1Desc': 'Fill in your item specs, condition, and contact information.',
    'sell.step2Title': 'Fast Valuation',
    'sell.step2Desc': 'Our appraisal team reviews and contacts you via Phone or WhatsApp.',
    'sell.step3Title': 'List & Sell Globally',
    'sell.step3Desc': 'Once agreed, we showcase your item to verified international buyers.',
    'sell.successTitle': 'Request Submitted Successfully!',
    'sell.successMessage': 'Thank you for submitting your equipment details. Our Japanese vehicle & machinery valuation team is reviewing your request and will contact you within 24 hours.',
    'sell.chatWhatsApp': 'Chat on WhatsApp',
    'sell.callDirect': 'Call Us Directly',
    'sell.submitAnother': 'Submit another vehicle or equipment',
    'sell.formTitle': 'Seller Request Form',
    'sell.formSubtitle': 'Please fill out the information below. All fields marked with * are required.',
    'sell.nameLabel': 'Customer Name',
    'sell.namePlaceholder': 'e.g. John Doe / 田中 太郎',
    'sell.phoneLabel': 'Phone Number / WhatsApp',
    'sell.phonePlaceholder': 'e.g. +81 90-1234-5678',
    'sell.emailLabel': 'Email Address',
    'sell.emailPlaceholder': 'e.g. customer@example.com',
    'sell.addressLabel': 'Address / Location',
    'sell.addressPlaceholder': 'e.g. Ibaraki, Japan / City & Country',
    'sell.categoryLabel': 'Item Category',
    'sell.descLabel': 'Description & Vehicle Details',
    'sell.descPlaceholder': 'Describe your item in detail: Make, Model, Year, Mileage or Operating Hours, Condition, Engine/Transmission, Asking Price, or any special fixtures.',
    'sell.photosLabel': 'Photos (Optional, Up to 5)',
    'sell.photosHint': 'Upload photos of the front, interior, machinery plate, or condition.',
    'sell.addPhoto': 'Add Photo',
    'sell.submitting': 'Submitting Request...',
    'sell.submitBtn': 'Submit Selling Request',
    'sell.errName': 'Please enter your name.',
    'sell.errPhone': 'Please enter your phone or WhatsApp number.',
    'sell.errEmail': 'Please enter your email address.',
    'sell.errAddress': 'Please enter your location or address.',
    'sell.errDescription': 'Please describe the vehicle, machine, or parts you wish to sell.',
    'sell.submitError': 'Failed to submit request. Please try again or contact us directly.',
    'admin.tabInventory': 'Inventory Management',
    'admin.tabInquiries': 'Seller Inquiries',
    'admin.portal': 'ADMIN PORTAL',

    // Language
    'lang.en': 'English',
    'lang.ja': '日本語',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.loading': 'Loading...',
  },
  ja: {
    // Navigation
    'nav.home': 'ホーム',
    'nav.collection': 'コレクション',
    'nav.about': '会社概要',
    'nav.contact': 'お問い合わせ',
    'nav.message': 'LINE相談',
    'nav.sell': '出品・売却',
    'nav.sellWithUs': '車両・重機の売却相談',
    'nav.admin': '管理者',

    // Red Banner Slider
    'banner.badge1': '公式輸出パートナー',
    'banner.title1': 'BIKSトレーディングへようこそ',
    'banner.subtitle1': '日本の高品質な中古車・トラック・重機を世界各地へダイレクト輸出',
    'banner.tag1': '厳選良品',
    'banner.badge2': '世界海上輸送便',
    'banner.title2': '大型重機・トラック海上輸送エクスプレス',
    'banner.subtitle2': '世界主要港への迅速・確実なRORO船＆コンテナ輸送手配',
    'banner.tag2': '最短手配',
    'banner.badge3': '公認オークション会員',
    'banner.title3': '全国オートオークション＆建機直接買い付け',
    'banner.subtitle3': '東京・横浜・名古屋の主要会場から厳選仕入れ・公的検査対応',
    'banner.tag3': '安心保証',
    'banner.ctaCollection': 'コレクションを見る',
    'banner.ctaShipping': '輸出実績を見る',
    'banner.ctaContact': 'お問い合わせ',

    // Home Hero
    'home.heroBadge': 'BIKSトレーディングカンパニー',
    'home.heroTitle': '高品質な日本車両を世界へ。',
    'home.viewVehicle': '車両を見る',
    'home.browseVehicles': '在庫車両を見る',

    // Home - Featured Vehicles Showcase
    'home.showcaseEyebrow': '注目のコレクション',
    'home.showcaseTitle': '注目の車両・重機',
    'home.seeAllCollections': 'すべてのコレクションを見る',
    'home.noVehiclesTitle': '注目の車両は現在ありません',
    'home.noVehiclesDesc': 'すべての車両・重機・パーツをご覧になるにはコレクションページをご確認ください。',

    // Home - Why Choose BIKS (Restored + 'Buying and Selling a Vehicle')
    'home.whyEyebrow': 'BIKSが選ばれる理由',
    'home.whyHeading1': '車両の売買だけにとどまらない、',
    'home.whyHeading2': '車両の購入・販売を超えて。',
    'home.whyHeading3': 'トータルな貿易体験をお届けします。',
    'home.whyDesc': '日本のオートオークションでの買い付けから、徹底した車両点検、透明な価格設定、世界主要港への海上輸送まで、すべての工程を正確かつ安心してお任せいただけます。',
    'home.whyTrustLabel': '日本の車両輸出における信頼のパートナー',

    // Home - Final CTA (Strictly BIKS Trading Company, no Car)
    'home.ctaHeading': '次のお車・重機のご相談は',
    'home.ctaCompany': 'BIKS Trading Company と共に。',
    'home.ctaDesc': 'ご希望の車種や機械をお聞かせください。専門スタッフが最適な車両をお探しし、通関・海上輸送まで万全にサポートいたします。',
    'home.ctaButton': 'お問い合わせ',
    'home.ctaTrust1': '国内オークション直接買い付け',
    'home.ctaTrust2': '世界各国への海上輸出',
    'home.ctaTrust3': '明瞭かつ公正な価格',

    // About Page (Restored)
    'about.badge': 'BIKS TRADING COMPANY',
    'about.heroTitle1': '高品質な日本車両。',
    'about.heroTitle2': 'グローバル輸出サービス。',
    'about.heroDesc': 'BIKSは、透明性の高い取引、厳格な点検、そして輸出に関わる総合的なサポートを通じて、世界中のバイヤーと日本の高品質車を結びます。',
    'about.browseVehicles': '在庫車両を見る',
    'about.contactUs': 'お問い合わせ',
    'about.trustPricing': '明瞭な価格設定',
    'about.trustInspections': '公的・厳格な点検基準',

    'about.foundationEyebrow': '当社の基盤',
    'about.foundationTitle': 'BIKSの強みとこだわり',
    'about.foundationSubtitle': 'すべてのお取引とお客様とのパートナーシップを支える基本理念です。',
    'about.val1Title': '信頼と透明性',
    'about.val1Desc': 'すべてのお取引は事前の明瞭な価格設定とともに詳細に開示されます。隠れた費用や予期せぬ請求は一切ありません。',
    'about.val2Title': '品質第一主義',
    'about.val2Desc': '厳格なマルチポイント点検プロセスにより、確実に状態が確認された良質な車両のみを世界中のお客様へお届けします。',
    'about.val3Title': 'お客様第一のサポート',
    'about.val3Desc': '専任のアカウント担当者が、購入からシッピング、到着までの全プロセスをきめ細やかにナビゲートします。',

    'about.historyEyebrow': '当社の歩み',
    'about.historyTitle': '実績と信頼の歴史',
    'about.historySubtitle': '横浜の輸出業者から始まり、今では世界中のお客様に選ばれるパートナーへと成長いたしました。',
    'about.milestone1Year': '2016',
    'about.milestone1Title': '横浜にて設立',
    'about.milestone1Desc': '日本車および産業機械のプレミアム輸出商社としてBIKSを設立。',

    'about.ctaTitle': '私たちと一緒に',
    'about.ctaTitleHighlight': '最適なフリートを築きませんか？',
    'about.ctaDesc': '1台のご注文からコンテナ単位の大量輸送まで、BIKSが培った専門知識でスムーズにお応えします。',
    'about.ctaButton': '今すぐ相談する',
    'about.ctaTrust1': '日本品質の安心感',
    'about.ctaTrust2': '世界各地への輸出実績',
    'about.ctaTrust3': '誠実で透明なサービス',

    // Collection Page
    'collection.title': '車両・重機・パーツ コレクション',
    'collection.subtitle': '日本国内から厳選された高品質な中古車、トラック、産業機械、特殊パーツの一覧です。',
    'collection.searchPlaceholder': 'メーカー、モデル名、車台番号で検索...',
    'collection.filters': '絞り込み条件',
    'collection.category': 'カテゴリー',
    'collection.allCategories': 'すべてのカテゴリー',
    'collection.make': 'メーカー / ブランド',
    'collection.priceRange': 'FOB価格帯 (USD)',
    'collection.year': '年式',
    'collection.transmission': 'ミッション',
    'collection.fuel': '燃料種別',
    'collection.status': '在庫ステータス',
    'collection.clearAll': '条件をクリア',
    'collection.noResults': '該当する車両または機械が見つかりませんでした。',
    'collection.tryClearing': '検索キーワードやフィルター条件を変更してお試しください。',
    'collection.showing': '表示中:',
    'collection.vehiclesCount': '台の在庫',
    'collection.sortNewest': '新着順',
    'collection.sortPriceAsc': '価格が安い順',
    'collection.sortPriceDesc': '価格が高い順',
    'collection.sortYearDesc': '年式が新しい順',
    'collection.sortMileageAsc': '走行距離が少ない順',

    // Categories
    'cat.Trucks': 'トラック',
    'cat.Cars': '乗用車',
    'cat.Tyre Shover': 'タイヤショベル (ホイールローダー)',
    'cat.Forklifts': 'フォークリフト',
    'cat.Agricultural Machines': '農業機械',
    'cat.Truck Fixtures': 'トラック架装・部品',
    'cat.Other Parts': 'その他パーツ',

    // Vehicle Details
    'details.backToInventory': 'コレクションへ戻る',
    'details.specifications': '車両詳細スペック',
    'details.make': 'メーカー',
    'details.model': 'モデル名',
    'details.year': '年式',
    'details.category': 'カテゴリー',
    'details.bodyType': 'ボディタイプ',
    'details.engineSize': '排気量 (CC)',
    'details.fuelType': '燃料',
    'details.transmission': 'トランスミッション',
    'details.mileage': '走行距離',
    'details.color': 'ボディカラー',
    'details.chassisNumber': '車台番号',
    'details.location': '保管場所',
    'details.features': '装備・特徴',
    'details.inquireNow': 'この車両について問い合わせる',
    'details.callUs': 'お電話でのお問い合わせ',
    'details.priceFob': 'FOB参考価格',
    'details.status': '在庫状態',

    // Footer
    'footer.about': 'BIKS Trading Companyは、厳格な点検と安心の海上輸送で、世界各地へ高品質な中古車および重機をお届けする信頼の日本輸出商社です。',
    'footer.company': '企業情報',
    'footer.categories': '取り扱いカテゴリー',
    'footer.contact': 'お問い合わせ先',
    'footer.contactInfo': 'お問い合わせ情報',
    'footer.addressLine1': '〒306-0126',
    'footer.addressLine2': '茨城県古河市諸川1315-15',
    'footer.addressLine3': '日本',
    'footer.rights': '無断転載を禁じます。',
    'footer.lineConnect': 'LINE公式アカウント',
    'footer.lineScan': 'スキャンまたはクリックで追加',

    // Admin Dashboard
    'admin.dashboard': '在庫管理ダッシュボード',
    'admin.totalVehicles': '総在庫台数',
    'admin.availableVehicles': '在庫あり',
    'admin.reservedVehicles': '商談中',
    'admin.soldVehicles': '売約済み',
    'admin.addNewVehicle': '車両を新規登録',
    'admin.manageCategories': 'カテゴリー管理',
    'admin.searchPlaceholder': '在庫を検索...',
    'admin.allCategories': 'すべてのカテゴリー',
    'admin.allStatuses': 'すべてのステータス',
    'admin.photo': '写真',
    'admin.vehicle': '車両情報',
    'admin.year': '年式',
    'admin.category': 'カテゴリー',
    'admin.price': '価格 (FOB)',
    'admin.status': 'ステータス',
    'admin.actions': '操作',
    'admin.edit': '編集',
    'admin.delete': '削除',
    'admin.noVehiclesFound': '該当する車両データがありません。',
    'admin.confirmDelete': 'この車両データを削除してもよろしいですか？',
    'admin.deleteFailed': '車両の削除に失敗しました',
    'admin.logout': 'ログアウト',
    'admin.accountSettings': 'アカウント設定',

    // Vehicle Form Modal
    'form.addTitle': '新規車両登録',
    'form.editTitle': '車両情報の編集',
    'form.make': 'メーカー名',
    'form.model': '車種・モデル名',
    'form.year': '年式 (西暦)',
    'form.category': 'カテゴリー',
    'form.newCategory': '+ 新規カテゴリーを追加',
    'form.bodyType': 'ボディタイプ',
    'form.transmission': 'トランスミッション',
    'form.fuelType': '燃料種別',
    'form.engineCc': '排気量 (cc)',
    'form.mileage': '走行距離 (km)',
    'form.color': '外装色',
    'form.priceJpy': 'FOB価格 (円)',
    'form.priceUsd': 'FOB価格 (米ドル)',
    'form.status': '在庫ステータス',
    'form.location': '保管ヤード場所',
    'form.chassis': '車台番号',
    'form.mainImage': 'メイン写真 (WebP自動最適化)',
    'form.galleryImages': 'ギャラリー写真 (最大20枚)',
    'form.features': '装備・特徴 (カンマ区切り)',
    'form.featured': 'おすすめ・注目車両 (Featured)',
    'form.addCategory': '+ 新規カテゴリーを追加',
    'form.save': '車両情報を保存',
    'form.updating': '更新中...',
    'form.creating': '登録中...',
    'form.cancel': 'キャンセル',

    // Admin Login (Generic Placeholders)
    'login.title': '管理者ログイン',
    'login.subtitle': '在庫管理システムへログインしてください',
    'login.email': 'メールアドレス',
    'login.emailPlaceholder': 'メールアドレスを入力',
    'login.password': 'パスワード',
    'login.passwordPlaceholder': 'パスワードを入力',
    'login.submit': 'ログイン',
    'login.submitting': 'ログイン中...',
    'login.back': 'ホームへ戻る',

    // Status
    'status.Available': '在庫あり',
    'status.Reserved': '商談中',
    'status.Sold': '売約済み',
    'status.In Transit': '輸送中',
    'status.Delivered': '納車完了',

    // Sell Page
    'sell.badge': 'BIKS 車両・重機 買取＆委託販売',
    'sell.title': 'お持ちの重機・トラック・乗用車をBIKSで高価売却',
    'sell.subtitle': '世界50カ国以上の海外バイヤーと直結。お持ちの機械、トラック、自動車の情報を入力いただければ、専門査定チームが迅速に査定しご連絡いたします。',
    'sell.stat1': '高価買取・高額売却',
    'sell.stat2': '世界中のバイヤー',
    'sell.stat3': '24時間以内連絡',
    'sell.stat4': '安心・面倒ゼロ輸出',
    'sell.step1Title': '情報の送信',
    'sell.step1Desc': '車両や機械のスペック、状態、連絡先を入力してください。',
    'sell.step2Title': 'スピード査定',
    'sell.step2Desc': '査定チームが確認し、お電話またはWhatsApp等でご連絡します。',
    'sell.step3Title': '世界へ出品・売却',
    'sell.step3Desc': '条件合意後、海外の優良バイヤーに向けて迅速に販売します。',
    'sell.successTitle': '送信が完了いたしました！',
    'sell.successMessage': '車両・重機の情報をお送りいただきありがとうございます。専門査定チームが内容を確認の上、24時間以内にご連絡させていただきます。',
    'sell.chatWhatsApp': 'WhatsAppで相談',
    'sell.callDirect': '電話で直接問い合わせ',
    'sell.submitAnother': '他の車両・機械も送信する',
    'sell.formTitle': '売却・出品リクエストフォーム',
    'sell.formSubtitle': '以下の項目をご入力ください。* は必須項目です。',
    'sell.nameLabel': 'お名前 / 会社名',
    'sell.namePlaceholder': '例: 田中 太郎 / 山田商事',
    'sell.phoneLabel': '電話番号 / WhatsApp',
    'sell.phonePlaceholder': '例: 090-1234-5678 / +81 90-1234-5678',
    'sell.emailLabel': 'メールアドレス',
    'sell.emailPlaceholder': '例: info@example.com',
    'sell.addressLabel': '所在地 / ご住所',
    'sell.addressPlaceholder': '例: 茨城県古河市 / 都市名',
    'sell.categoryLabel': 'カテゴリー',
    'sell.descLabel': '車両・機械の詳細・説明',
    'sell.descPlaceholder': 'メーカー、車種/型式、年式、走行距離または稼働時間、状態、希望売却価格などを詳しくご記入ください。',
    'sell.photosLabel': '写真（任意・最大5枚）',
    'sell.photosHint': '車両の外観、内装、銘板（コーションプレート）などの写真を添付できます。',
    'sell.addPhoto': '写真を追加',
    'sell.submitting': '送信中...',
    'sell.submitBtn': '売却リクエストを送信する',
    'sell.errName': 'お名前を入力してください。',
    'sell.errPhone': '電話番号を入力してください。',
    'sell.errEmail': 'メールアドレスを入力してください。',
    'sell.errAddress': '所在地を入力してください。',
    'sell.errDescription': '車両・機械の詳細を入力してください。',
    'sell.submitError': '送信に失敗しました。時間をおいて再試行いただくか、直接お電話でお問い合わせください。',
    'admin.tabInventory': '在庫車両管理',
    'admin.tabInquiries': '売却・出品相談',
    'admin.portal': '管理者ポータル',

    // Language
    'lang.en': 'English',
    'lang.ja': '日本語',
    'common.cancel': 'キャンセル',
    'common.save': '保存',
    'common.loading': '読み込み中...',
  },
} as const;

export type TranslationKey = keyof typeof translations['en'];

/* ============================================================================
   DYNAMIC DATABASE DATA TRANSLATION HELPERS
   Translates dynamic values returned from the database into Japanese on the fly
============================================================================ */

export const dynamicCategoryMap: Record<string, string> = {
  'Trucks': 'トラック',
  'Cars': '乗用車',
  'Tyre Shover': 'タイヤショベル (ホイールローダー)',
  'Forklifts': 'フォークリフト',
  'Agricultural Machines': '農業機械',
  'Agriculture Machines': '農業機械',
  'Truck Fixtures': 'トラック架装・部品',
  'Other Parts': 'その他パーツ',
  'Excavators': '油圧ショベル (ユンボ)',
  'Buses': 'バス',
  'Machinery': '重機・建設機械',
};

export const dynamicStatusMap: Record<string, string> = {
  'Available': '在庫あり',
  'Reserved': '商談中',
  'Sold': '売約済み',
  'In Transit': '輸送中',
  'Delivered': '納車完了',
};

export const dynamicFuelMap: Record<string, string> = {
  'Petrol': 'ガソリン',
  'Gasoline': 'ガソリン',
  'Diesel': 'ディーゼル',
  'Hybrid': 'ハイブリッド',
  'Electric': '電気 (EV)',
};

export const dynamicTransmissionMap: Record<string, string> = {
  'Automatic': 'オートマ (AT)',
  'Manual': 'マニュアル (MT)',
  'AT': 'オートマ (AT)',
  'MT': 'マニュアル (MT)',
  'CVT': 'CVT',
};

export const dynamicColorMap: Record<string, string> = {
  'White': 'ホワイト (白)',
  'Pearl': 'パールホワイト',
  'Pearl White': 'パールホワイト',
  'Black': 'ブラック (黒)',
  'Silver': 'シルバー (銀)',
  'Blue': 'ブルー (青)',
  'Red': 'レッド (赤)',
  'Gray': 'グレー (灰)',
  'Grey': 'グレー (灰)',
  'Green': 'グリーン (緑)',
  'Yellow': 'イエロー (黄)',
  'Brown': 'ブラウン (茶)',
  'Gold': 'ゴールド (金)',
};

export const dynamicBodyTypeMap: Record<string, string> = {
  'SUV': 'SUV',
  'Sedan': 'セダン',
  'Truck': 'トラック',
  'Van': 'バン',
  'Hatchback': 'ハッチバック',
  'Wagon': 'ステーションワゴン',
  'Coupe': 'クーペ',
};

export const dynamicFeatureMap: Record<string, string> = {
  'Air Conditioning': 'エアコン',
  'A/C': 'エアコン',
  'Power Steering': 'パワーステアリング',
  'Power Windows': 'パワーウィンドウ',
  'ABS': 'ABS (アンチロックブレーキ)',
  'Airbags': 'エアバッグ',
  'Airbag': 'エアバッグ',
  'Navigation': 'カーナビ',
  'Navi': 'カーナビ',
  'Backup Camera': 'バックカメラ',
  'Rear Camera': 'バックカメラ',
  'Leather Seats': '本革シート',
  'Sunroof': 'サンルーフ',
  'Alloy Wheels': 'アルミホイール',
  '4WD': '4WD (四輪駆動)',
  'Keyless Entry': 'キーレスエントリー',
  'Push Start': 'プッシュスタート',
  'Cruise Control': 'クルーズコントロール',
  'Bluetooth': 'Bluetooth',
  'ETC': 'ETC車載器',
};

export function translateCategory(cat?: string, lang: Language = 'en'): string {
  if (!cat) return '';
  if (lang === 'ja') return dynamicCategoryMap[cat] || cat;
  return cat;
}

export function translateStatus(status?: string, lang: Language = 'en'): string {
  if (!status) return '';
  if (lang === 'ja') return dynamicStatusMap[status] || status;
  return status;
}

export function translateTransmission(trans?: string, lang: Language = 'en'): string {
  if (!trans) return '';
  if (lang === 'ja') return dynamicTransmissionMap[trans] || trans;
  return trans;
}

export function translateFuel(fuel?: string, lang: Language = 'en'): string {
  if (!fuel) return '';
  if (lang === 'ja') return dynamicFuelMap[fuel] || fuel;
  return fuel;
}

export function translateColor(color?: string, lang: Language = 'en'): string {
  if (!color) return '';
  if (lang === 'ja') return dynamicColorMap[color] || color;
  return color;
}

export function translateBodyType(body?: string, lang: Language = 'en'): string {
  if (!body) return '';
  if (lang === 'ja') return dynamicBodyTypeMap[body] || body;
  return body;
}

export function translateFeature(feat: string, lang: Language = 'en'): string {
  if (!feat) return '';
  if (lang === 'ja') return dynamicFeatureMap[feat.trim()] || feat;
  return feat;
}

/* ============================================================================
   USER-FACING LANGUAGE CONTEXT (Stored in biks_user_lang)
   Changing this NEVER alters the Admin language.
============================================================================ */

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey | string, fallback?: string) => string;
  categoryLabel: (cat?: string | null) => string;
  translateCat: (cat?: string | null) => string;
  translateSt: (st?: string | null) => string;
  translateTrans: (trans?: string | null) => string;
  translateF: (f?: string | null) => string;
  translateCol: (col?: string | null) => string;
  translateFeat: (feat?: string | null) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang');
      if (urlLang === 'ja' || urlLang === 'en') {
        localStorage.setItem('biks_user_lang', urlLang);
        return urlLang;
      }
      const saved = localStorage.getItem('biks_user_lang') || localStorage.getItem('biks_lang');
      return (saved === 'ja' || saved === 'en') ? saved : 'en';
    } catch (e) {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('biks_user_lang', lang);
    } catch (e) {}
  };

  const t = (key: TranslationKey | string, fallback?: string): string => {
    const dict = translations[language] as Record<string, string>;
    if (dict && dict[key]) return dict[key];
    const enDict = translations.en as Record<string, string>;
    if (enDict && enDict[key]) return enDict[key];
    return fallback || key;
  };

  const categoryLabel = (cat?: string | null): string => translateCategory(cat || '', language);
  const translateCat = (cat?: string | null) => translateCategory(cat || '', language);
  const translateSt = (st?: string | null) => translateStatus(st || '', language);
  const translateTrans = (trans?: string | null) => translateTransmission(trans || '', language);
  const translateF = (f?: string | null) => translateFuel(f || '', language);
  const translateCol = (col?: string | null) => translateColor(col || '', language);
  const translateFeat = (feat?: string | null) => translateFeature(feat || '', language);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      categoryLabel,
      translateCat,
      translateSt,
      translateTrans,
      translateF,
      translateCol,
      translateFeat
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

/* ============================================================================
   ADMIN-SPECIFIC LANGUAGE CONTEXT (Stored in biks_admin_lang)
   Completely isolated from public client language switcher.
============================================================================ */

interface AdminLanguageContextType {
  adminLanguage: Language;
  setAdminLanguage: (lang: Language) => void;
  t: (key: TranslationKey | string, fallback?: string) => string;
  categoryLabel: (cat?: string | null) => string;
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined);

export function AdminLanguageProvider({ children }: { children: React.ReactNode }) {
  const [adminLanguage, setAdminLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('biks_admin_lang');
      return (saved === 'ja' || saved === 'en') ? saved : 'en';
    } catch (e) {
      return 'en';
    }
  });

  const setAdminLanguage = (lang: Language) => {
    setAdminLanguageState(lang);
    try {
      localStorage.setItem('biks_admin_lang', lang);
    } catch (e) {}
  };

  const t = (key: TranslationKey | string, fallback?: string): string => {
    const dict = translations[adminLanguage] as Record<string, string>;
    if (dict && dict[key]) return dict[key];
    const enDict = translations.en as Record<string, string>;
    if (enDict && enDict[key]) return enDict[key];
    return fallback || key;
  };

  const categoryLabel = (cat?: string | null): string => translateCategory(cat || '', adminLanguage);

  return (
    <AdminLanguageContext.Provider value={{ adminLanguage, setAdminLanguage, t, categoryLabel }}>
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminTranslation() {
  const context = useContext(AdminLanguageContext);
  if (!context) {
    // Graceful fallback if invoked outside AdminLanguageProvider
    const saved = (typeof window !== 'undefined' ? localStorage.getItem('biks_admin_lang') : 'en') as Language || 'en';
    const t = (key: TranslationKey | string, fallback?: string): string => {
      const dict = translations[saved] as Record<string, string>;
      if (dict && dict[key]) return dict[key];
      const enDict = translations.en as Record<string, string>;
      if (enDict && enDict[key]) return enDict[key];
      return fallback || key;
    };
    return {
      adminLanguage: saved,
      setAdminLanguage: (lang: Language) => {
        try { localStorage.setItem('biks_admin_lang', lang); } catch (e) {}
      },
      t,
      categoryLabel: (cat?: string | null) => translateCategory(cat || '', saved)
    };
  }
  return context;
}
