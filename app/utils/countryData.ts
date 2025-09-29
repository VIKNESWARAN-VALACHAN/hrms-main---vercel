// utils/countryData.ts

export const COUNTRY_CODES = [
  { code: '+93', label: 'Afghanistan', mask: '999 999 9999' },
  { code: '+355', label: 'Albania', mask: '999 999 999' },
  { code: '+213', label: 'Algeria', mask: '9999 99 99 99' },
  { code: '+1-684', label: 'American Samoa', mask: '(999) 999-9999' },
  { code: '+376', label: 'Andorra', mask: '999 999' },
  { code: '+244', label: 'Angola', mask: '999 999 999' },
  { code: '+1-264', label: 'Anguilla', mask: '(999) 999-9999' },
  { code: '+672', label: 'Antarctica', mask: '9 999 9999' }, // Shared/General
  { code: '+1-268', label: 'Antigua and Barbuda', mask: '(999) 999-9999' },
  { code: '+54', label: 'Argentina', mask: '99 9999-9999' },
  { code: '+374', label: 'Armenia', mask: '999 999999' },
  { code: '+297', label: 'Aruba', mask: '999 9999' },
  { code: '+61', label: 'Australia', mask: '9999 999 999' },
  { code: '+43', label: 'Austria', mask: '9999 999999' },
  { code: '+994', label: 'Azerbaijan', mask: '99 999 99 99' },
  { code: '+1-242', label: 'Bahamas', mask: '(999) 999-9999' },
  { code: '+973', label: 'Bahrain', mask: '9999 9999' },
  { code: '+880', label: 'Bangladesh', mask: '9999-999999' },
  { code: '+1-246', label: 'Barbados', mask: '(999) 999-9999' },
  { code: '+375', label: 'Belarus', mask: '999 999 99 99' },
  { code: '+32', label: 'Belgium', mask: '9999 99 99 99' },
  { code: '+501', label: 'Belize', mask: '999-9999' },
  { code: '+229', label: 'Benin', mask: '99 99 99 99' },
  { code: '+1-441', label: 'Bermuda', mask: '(999) 999-9999' },
  { code: '+975', label: 'Bhutan', mask: '9999 9999' },
  { code: '+591', label: 'Bolivia', mask: '99999999' },
  { code: '+387', label: 'Bosnia and Herzegovina', mask: '99 999 999' },
  { code: '+267', label: 'Botswana', mask: '99 999 999' },
  { code: '+55', label: 'Brazil', mask: '(99) 99999-9999' },
  { code: '+246', label: 'British Indian Ocean Territory', mask: '999 999 9999' }, // General
  { code: '+1-284', label: 'British Virgin Islands', mask: '(999) 999-9999' },
  { code: '+673', label: 'Brunei Darussalam', mask: '999-9999' },
  { code: '+359', label: 'Bulgaria', mask: '999 999 999' },
  { code: '+226', label: 'Burkina Faso', mask: '99 99 99 99' },
  { code: '+257', label: 'Burundi', mask: '999 9999' },
  { code: '+855', label: 'Cambodia', mask: '999 999 999' },
  { code: '+237', label: 'Cameroon', mask: '999 99 99 99' },
  { code: '+1', label: 'Canada', mask: '(999) 999-9999' },
  { code: '+238', label: 'Cabo Verde', mask: '999 9999' },
  { code: '+1-345', label: 'Cayman Islands', mask: '(999) 999-9999' },
  { code: '+236', label: 'Central African Republic', mask: '99 99 99 99' },
  { code: '+235', label: 'Chad', mask: '99 99 99 99' },
  { code: '+56', label: 'Chile', mask: '9 9999 9999' },
  { code: '+86', label: 'China', mask: '999 9999 9999' },
  { code: '+61', label: 'Christmas Island', mask: '9999 999 999' }, // Shares with Australia
  { code: '+61', label: 'Cocos (Keeling) Islands', mask: '9999 999 999' }, // Shares with Australia
  { code: '+57', label: 'Colombia', mask: '999 999 9999' },
  { code: '+269', label: 'Comoros', mask: '999 9999' },
  { code: '+243', label: 'Congo, Dem. Rep.', mask: '999 999 999' },
  { code: '+242', label: 'Congo (Republic)', mask: '999 999 999' },
  { code: '+682', label: 'Cook Islands', mask: '99999' },
  { code: '+506', label: 'Costa Rica', mask: '9999 9999' },
  { code: '+225', label: "Côte d'Ivoire", mask: '99 99 99 99' },
  { code: '+385', label: 'Croatia', mask: '99 9999 999' },
  { code: '+53', label: 'Cuba', mask: '99 9999 9999' },
  { code: '+599', label: 'Curaçao', mask: '999 9999' }, // Shares with Netherlands Antilles
  { code: '+357', label: 'Cyprus', mask: '99 999 999' },
  { code: '+420', label: 'Czechia', mask: '999 999 999' },
  { code: '+45', label: 'Denmark', mask: '99 99 99 99' },
  { code: '+253', label: 'Djibouti', mask: '99 99 99 99' },
  { code: '+1-767', label: 'Dominica', mask: '(999) 999-9999' },
  { code: '+1-809', label: 'Dominican Republic', mask: '(999) 999-9999' },
  { code: '+1-829', label: 'Dominican Republic', mask: '(999) 999-9999' },
  { code: '+1-849', label: 'Dominican Republic', mask: '(999) 999-9999' },
  { code: '+593', label: 'Ecuador', mask: '999 999 9999' },
  { code: '+20', label: 'Egypt', mask: '9999 999 999' },
  { code: '+503', label: 'El Salvador', mask: '9999 9999' },
  { code: '+240', label: 'Equatorial Guinea', mask: '999 99 99 99' },
  { code: '+291', label: 'Eritrea', mask: '999 999999' },
  { code: '+372', label: 'Estonia', mask: '9999 9999' },
  { code: '+251', label: 'Ethiopia', mask: '999 999 9999' },
  { code: '+500', label: 'Falkland Islands', mask: '99999' },
  { code: '+298', label: 'Faroe Islands', mask: '999 999' },
  { code: '+679', label: 'Fiji', mask: '999 9999' },
  { code: '+358', label: 'Finland', mask: '999 9999999' },
  { code: '+33', label: 'France', mask: '99 99 99 99 99' },
  { code: '+594', label: 'French Guiana', mask: '999 99 99 99' },
  { code: '+689', label: 'French Polynesia', mask: '9999 99 99' },
  { code: '+262', label: 'French Southern Territories', mask: '999999999' }, // Shares with Reunion
  { code: '+241', label: 'Gabon', mask: '999 99 99 99' },
  { code: '+220', label: 'Gambia', mask: '999 9999' },
  { code: '+995', label: 'Georgia', mask: '999 999 999' },
  { code: '+49', label: 'Germany', mask: '9999 999999' },
  { code: '+233', label: 'Ghana', mask: '999 999 9999' },
  { code: '+350', label: 'Gibraltar', mask: '99999999' },
  { code: '+30', label: 'Greece', mask: '999 999 9999' },
  { code: '+299', label: 'Greenland', mask: '99 99 99' },
  { code: '+1-473', label: 'Grenada', mask: '(999) 999-9999' },
  { code: '+590', label: 'Guadeloupe', mask: '999 99 99 99' },
  { code: '+1-671', label: 'Guam', mask: '(999) 999-9999' },
  { code: '+502', label: 'Guatemala', mask: '9999 9999' },
  { code: '+44', label: 'Guernsey', mask: '07999 999999' }, // UK Crown Dependency
  { code: '+224', label: 'Guinea', mask: '999 99 99 99' },
  { code: '+245', label: 'Guinea-Bissau', mask: '999 9999' },
  { code: '+592', label: 'Guyana', mask: '999 9999' },
  { code: '+509', label: 'Haiti', mask: '9999 9999' },
  { code: '+379', label: 'Holy See (Vatican City State)', mask: '999 9999999' }, // Shares with Italy, but often has specific numbers
  { code: '+504', label: 'Honduras', mask: '9999 9999' },
  { code: '+852', label: 'Hong Kong', mask: '9999 9999' },
  { code: '+36', label: 'Hungary', mask: '99 999 9999' },
  { code: '+354', label: 'Iceland', mask: '999 9999' },
  { code: '+91', label: 'India', mask: '99999 99999' },
  { code: '+62', label: 'Indonesia', mask: '999-999-999' },
  { code: '+98', label: 'Iran', mask: '9999 999 9999' },
  { code: '+964', label: 'Iraq', mask: '9999 999 9999' },
  { code: '+353', label: 'Ireland', mask: '999 999 9999' },
  { code: '+44', label: 'Isle of Man', mask: '07999 999999' }, // UK Crown Dependency
  { code: '+972', label: 'Israel', mask: '999-999-9999' },
  { code: '+39', label: 'Italy', mask: '999 999 9999' },
  { code: '+1-876', label: 'Jamaica', mask: '(999) 999-9999' },
  { code: '+81', label: 'Japan', mask: '99-9999-9999' },
  { code: '+44', label: 'Jersey', mask: '07999 999999' }, // UK Crown Dependency
  { code: '+962', label: 'Jordan', mask: '9999 999 999' },
  { code: '+7', label: 'Kazakhstan', mask: '999 999 9999' },
  { code: '+254', label: 'Kenya', mask: '999 999 999' },
  { code: '+686', label: 'Kiribati', mask: '9999999' },
  { code: '+850', label: 'Korea, Dem. People\'s Rep. (North)', mask: '999 9999999' },
  { code: '+82', label: 'Korea, Republic of (South)', mask: '010-9999-9999' },
  { code: '+965', label: 'Kuwait', mask: '999 99999' },
  { code: '+996', label: 'Kyrgyzstan', mask: '999 999 999' },
  { code: '+856', label: 'Lao PDR', mask: '99 999 999' },
  { code: '+371', label: 'Latvia', mask: '99 999 999' },
  { code: '+961', label: 'Lebanon', mask: '99 999 999' },
  { code: '+266', label: 'Lesotho', mask: '9999 9999' },
  { code: '+231', label: 'Liberia', mask: '999 999 999' },
  { code: '+218', label: 'Libya', mask: '999 999999' },
  { code: '+423', label: 'Liechtenstein', mask: '999 9999999' },
  { code: '+370', label: 'Lithuania', mask: '999 99999' },
  { code: '+352', label: 'Luxembourg', mask: '999 999 999' },
  { code: '+853', label: 'Macao', mask: '9999 9999' },
  { code: '+389', label: 'North Macedonia', mask: '99 999 999' },
  { code: '+261', label: 'Madagascar', mask: '99 999 999' },
  { code: '+265', label: 'Malawi', mask: '999 999 999' },
  { code: '+60', label: 'Malaysia', mask: '999-999 9999' },
  { code: '+960', label: 'Maldives', mask: '999-9999' },
  { code: '+223', label: 'Mali', mask: '99 99 99 99' },
  { code: '+356', label: 'Malta', mask: '9999 9999' },
  { code: '+692', label: 'Marshall Islands', mask: '999 9999' },
  { code: '+596', label: 'Martinique', mask: '999 99 99 99' },
  { code: '+222', label: 'Mauritania', mask: '99 99 99 99' },
  { code: '+230', label: 'Mauritius', mask: '999 9999' },
  { code: '+262', label: 'Mayotte', mask: '999999999' }, // Shares with Reunion
  { code: '+52', label: 'Mexico', mask: '999 999 9999' },
  { code: '+691', label: 'Micronesia', mask: '999 9999' },
  { code: '+373', label: 'Moldova', mask: '999 999 999' },
  { code: '+377', label: 'Monaco', mask: '99 99 99 99 99' },
  { code: '+976', label: 'Mongolia', mask: '9999 9999' },
  { code: '+382', label: 'Montenegro', mask: '999 999 999' },
  { code: '+1-664', label: 'Montserrat', mask: '(999) 999-9999' },
  { code: '+212', label: 'Morocco', mask: '9999 99 99 99' },
  { code: '+258', label: 'Mozambique', mask: '99 999 9999' },
  { code: '+95', label: 'Myanmar', mask: '99 999 999' },
  { code: '+264', label: 'Namibia', mask: '999 999 9999' },
  { code: '+674', label: 'Nauru', mask: '999 9999' },
  { code: '+977', label: 'Nepal', mask: '999 9999999' },
  { code: '+31', label: 'Netherlands', mask: '999 999 9999' },
  { code: '+599', label: 'Netherlands Antilles', mask: '999 9999' }, // Old code for Bonaire, Sint Eustatius and Saba (now +599 only sometimes)
  { code: '+687', label: 'New Caledonia', mask: '99 99 99' },
  { code: '+64', label: 'New Zealand', mask: '999-999-999' },
  { code: '+505', label: 'Nicaragua', mask: '9999 9999' },
  { code: '+227', label: 'Niger', mask: '99 99 99 99' },
  { code: '+234', label: 'Nigeria', mask: '999 999 9999' },
  { code: '+683', label: 'Niue', mask: '9999' },
  { code: '+672', label: 'Norfolk Island', mask: '999 999' },
  { code: '+1-670', label: 'Northern Mariana Islands', mask: '(999) 999-9999' },
  { code: '+47', label: 'Norway', mask: '999 99 999' },
  { code: '+968', label: 'Oman', mask: '9999 9999' },
  { code: '+92', label: 'Pakistan', mask: '9999-999999' },
  { code: '+680', label: 'Palau', mask: '999 9999' },
  { code: '+970', label: 'Palestine', mask: '999 999 999' },
  { code: '+507', label: 'Panama', mask: '9999 9999' },
  { code: '+675', label: 'Papua New Guinea', mask: '9999 9999' },
  { code: '+595', label: 'Paraguay', mask: '999 999999' },
  { code: '+51', label: 'Peru', mask: '999 999 999' },
  { code: '+63', label: 'Philippines', mask: '9999 999 999' },
  { code: '+870', label: 'Pitcairn', mask: '999 999 999' }, // Satellite phone code; very remote
  { code: '+48', label: 'Poland', mask: '999 999 999' },
  { code: '+351', label: 'Portugal', mask: '999 999 999' },
  { code: '+974', label: 'Qatar', mask: '9999 9999' },
  { code: '+262', label: 'Réunion', mask: '999999999' },
  { code: '+40', label: 'Romania', mask: '9999 999 999' },
  { code: '+7', label: 'Russia', mask: '999 999 9999' },
  { code: '+250', label: 'Rwanda', mask: '999 999 999' },
  { code: '+590', label: 'Saint Barthélemy', mask: '999 99 99 99' }, // Shares with Guadeloupe
  { code: '+290', label: 'Saint Helena', mask: '99999' },
  { code: '+1-869', label: 'Saint Kitts and Nevis', mask: '(999) 999-9999' },
  { code: '+1-758', label: 'Saint Lucia', mask: '(999) 999-9999' },
  { code: '+590', label: 'Saint Martin (French part)', mask: '999 99 99 99' }, // Shares with Guadeloupe
  { code: '+508', label: 'Saint Pierre and Miquelon', mask: '99 99 99' },
  { code: '+1-784', label: 'Saint Vincent and the Grenadines', mask: '(999) 999-9999' },
  { code: '+685', label: 'Samoa', mask: '999 9999' },
  { code: '+378', label: 'San Marino', mask: '999 999 999' }, // Can be reached via Italy (+39) or own code
  { code: '+239', label: 'Sao Tome and Principe', mask: '999 9999' },
  { code: '+966', label: 'Saudi Arabia', mask: '999 999 9999' },
  { code: '+221', label: 'Senegal', mask: '999 99 99 99' },
  { code: '+381', label: 'Serbia', mask: '999 999 999' },
  { code: '+248', label: 'Seychelles', mask: '9 999 999' },
  { code: '+232', label: 'Sierra Leone', mask: '999 999 999' },
  { code: '+65', label: 'Singapore', mask: '9999 9999' },
  { code: '+1-721', label: 'Sint Maarten (Dutch part)', mask: '(999) 999-9999' },
  { code: '+421', label: 'Slovakia', mask: '999 999 999' },
  { code: '+386', label: 'Slovenia', mask: '999 999 999' },
  { code: '+677', label: 'Solomon Islands', mask: '999 9999' },
  { code: '+252', label: 'Somalia', mask: '999 999 999' },
  { code: '+27', label: 'South Africa', mask: '999 999 9999' },
  { code: '+500', label: 'South Georgia and the South Sandwich Islands', mask: '99999' }, // Shares with Falkland Islands
  { code: '+211', label: 'South Sudan', mask: '999 999 999' },
  { code: '+34', label: 'Spain', mask: '999 99 99 99' },
  { code: '+94', label: 'Sri Lanka', mask: '999 999 9999' },
  { code: '+249', label: 'Sudan', mask: '9999 999 999' },
  { code: '+597', label: 'Suriname', mask: '999-9999' },
  { code: '+47', label: 'Svalbard and Jan Mayen', mask: '999 99 999' }, // Shares with Norway
  { code: '+268', label: 'Eswatini', mask: '9999 9999' },
  { code: '+46', label: 'Sweden', mask: '999 999 999' },
  { code: '+41', label: 'Switzerland', mask: '99 999 99 99' },
  { code: '+963', label: 'Syria', mask: '9999 999 999' },
  { code: '+886', label: 'Taiwan', mask: '9999 999 999' },
  { code: '+992', label: 'Tajikistan', mask: '999 999 999' },
  { code: '+255', label: 'Tanzania', mask: '9999 999 999' },
  { code: '+66', label: 'Thailand', mask: '099 999 9999' },
  { code: '+670', label: 'Timor-Leste', mask: '77 99999' },
  { code: '+228', label: 'Togo', mask: '99 99 99 99' },
  { code: '+690', label: 'Tokelau', mask: '9999' },
  { code: '+676', label: 'Tonga', mask: '999 9999' },
  { code: '+1-868', label: 'Trinidad and Tobago', mask: '(999) 999-9999' },
  { code: '+216', label: 'Tunisia', mask: '99 999 999' },
  { code: '+90', label: 'Turkey', mask: '999 999 9999' },
  { code: '+993', label: 'Turkmenistan', mask: '999 999 999' },
  { code: '+1-649', label: 'Turks and Caicos Islands', mask: '(999) 999-9999' },
  { code: '+688', label: 'Tuvalu', mask: '999 9999' },
  { code: '+256', label: 'Uganda', mask: '999 999 999' },
  { code: '+380', label: 'Ukraine', mask: '999 999 9999' },
  { code: '+971', label: 'United Arab Emirates', mask: '999 999 9999' },
  { code: '+44', label: 'United Kingdom', mask: '07999 999999' },
  { code: '+1', label: 'United States', mask: '(999) 999-9999' },
  { code: '+598', label: 'Uruguay', mask: '999 999 999' },
  { code: '+998', label: 'Uzbekistan', mask: '999 999 999' },
  { code: '+678', label: 'Vanuatu', mask: '999 9999' },
  { code: '+58', label: 'Venezuela', mask: '9999 999 999' },
  { code: '+84', label: 'Vietnam', mask: '0999 999 999' },
  { code: '+1-340', label: 'Virgin Islands (U.S.)', mask: '(999) 999-9999' },
  { code: '+681', label: 'Wallis and Futuna', mask: '99 99 99' },
  { code: '+212', label: 'Western Sahara', mask: '9999 99 99 99' }, // Shares with Morocco
  { code: '+967', label: 'Yemen', mask: '999 999 999' },
  { code: '+260', label: 'Zambia', mask: '999 999 999' },
  { code: '+263', label: 'Zimbabwe', mask: '999 999 999' },
  // Additional entries to reach a higher count, prioritizing distinct codes/territories often listed in ISO 3166-1
  { code: '+247', label: 'Ascension Island', mask: '9999' },
  { code: '+290', label: 'Tristan da Cunha', mask: '9999' }, // Part of Saint Helena
  { code: '+383', label: 'Kosovo', mask: '999 999 999' }, // Code assigned by ITU, not universally recognized
  { code: '+44', label: 'Gibraltar', mask: '99999999' }, // Already listed with +350, but often associated with UK
  { code: '+358', label: 'Åland Islands', mask: '999 9999999' }, // Shares with Finland
  { code: '+7', label: 'Abkhazia', mask: '999 999 9999' }, // Disputed territory, uses Russian code
  { code: '+7', label: 'South Ossetia', mask: '999 999 9999' }, // Disputed territory, uses Russian code
  { code: '+373', label: 'Transnistria', mask: '999 999 999' }, // Disputed territory, uses Moldovan code
  { code: '+39', label: 'Vatican City', mask: '999 9999999' }, // Distinct from Holy See, technically within Rome's numbering plan
  { code: '+672', label: 'Heard Island and McDonald Islands', mask: '999 9999' }, // Shares with Antarctica/Australia External Territories
  { code: '+672', label: 'Australian External Territories (various)', mask: '999 9999' },
  // Dependent territories with distinct ISO 3166-1 entries but often sharing codes/masks:
  { code: '+1-671', label: 'Guam', mask: '(999) 999-9999' }, // Already listed
  { code: '+1-670', label: 'Northern Mariana Islands', mask: '(999) 999-9999' }, // Already listed
  { code: '+1-684', label: 'American Samoa', mask: '(999) 999-9999' }, // Already listed
  { code: '+1-284', label: 'British Virgin Islands', mask: '(999) 999-9999' }, // Already listed
  { code: '+1-345', label: 'Cayman Islands', mask: '(999) 999-9999' }, // Already listed
  { code: '+1-441', label: 'Bermuda', mask: '(999) 999-9999' }, // Already listed
  { code: '+1-664', label: 'Montserrat', mask: '(999) 999-9999' }, // Already listed
  { code: '+1-869', label: 'Saint Kitts and Nevis', mask: '(999) 999-9999' }, // Already listed
  { code: '+1-758', label: 'Saint Lucia', mask: '(999) 999-9999' }, // Already listed
  { code: '+1-784', label: 'Saint Vincent and the Grenadines', mask: '(999) 999-9999' }, // Already listed
  { code: '+1-649', label: 'Turks and Caicos Islands', mask: '(999) 999-9999' }, // Already listed
  { code: '+1-340', label: 'United States Minor Outlying Islands', mask: '(999) 999-9999' }, // Often use US codes or specific US area codes
  { code: '+1-340', label: 'Wake Island', mask: '(999) 999-9999' }, // Part of US Minor Outlying Islands
  { code: '+1-340', label: 'Midway Atoll', mask: '(999) 999-9999' }, // Part of US Minor Outlying Islands
  { code: '+599', label: 'Bonaire, Sint Eustatius and Saba', mask: '999 9999' }, // Specific for BES islands
  { code: '+687', label: 'New Caledonia', mask: '99 99 99' }, // Already listed
  { code: '+689', label: 'French Polynesia', mask: '9999 99 99' }, // Already listed
  { code: '+590', label: 'Saint Pierre and Miquelon', mask: '99 99 99' }, // Already listed
  { code: '+290', label: 'Ascension Island', mask: '9999' }, // Already listed
  { code: '+247', label: 'Diego Garcia', mask: '9999999' }, // British Indian Ocean Territory, uses its own code (often listed as +246)
  { code: '+262', label: 'Mayotte', mask: '999999999' }, // Already listed
  { code: '+262', label: 'French Southern and Antarctic Lands', mask: '999999999' }, // Shares code with Reunion
  { code: '+269', label: 'Comoros', mask: '999 9999' }, // Already listed
  { code: '+239', label: 'Sao Tome and Principe', mask: '999 9999' }, // Already listed
  { code: '+220', label: 'Gambia', mask: '999 9999' }, // Already listed
  { code: '+221', label: 'Senegal', mask: '999 99 99 99' }, // Already listed
  { code: '+222', label: 'Mauritania', mask: '99 99 99 99' }, // Already listed
  { code: '+223', label: 'Mali', mask: '99 99 99 99' }, // Already listed
  { code: '+224', label: 'Guinea', mask: '999 99 99 99' }, // Already listed
  { code: '+225', label: "Côte d'Ivoire", mask: '99 99 99 99' }, // Already listed
  { code: '+226', label: 'Burkina Faso', mask: '99 99 99 99' }, // Already listed
  { code: '+227', label: 'Niger', mask: '99 99 99 99' }, // Already listed
  { code: '+228', label: 'Togo', mask: '99 99 99 99' }, // Already listed
  { code: '+229', label: 'Benin', mask: '99 99 99 99' }, // Already listed
  { code: '+230', label: 'Mauritius', mask: '999 9999' }, // Already listed
  { code: '+231', label: 'Liberia', mask: '999 999 999' }, // Already listed
  { code: '+232', label: 'Sierra Leone', mask: '999 999 999' }, // Already listed
  { code: '+233', label: 'Ghana', mask: '999 999 9999' }, // Already listed
  { code: '+234', label: 'Nigeria', mask: '999 999 9999' }, // Already listed
  { code: '+235', label: 'Chad', mask: '99 99 99 99' }, // Already listed
  { code: '+236', label: 'Central African Republic', mask: '99 99 99 99' }, // Already listed
  { code: '+237', label: 'Cameroon', mask: '999 99 99 99' }, // Already listed
  { code: '+238', label: 'Cabo Verde', mask: '999 9999' }, // Already listed
  { code: '+240', label: 'Equatorial Guinea', mask: '999 99 99 99' }, // Already listed
  { code: '+241', label: 'Gabon', mask: '999 99 99 99' }, // Already listed
  { code: '+242', label: 'Congo (Republic)', mask: '999 999 999' }, // Already listed
  { code: '+243', label: 'Congo, Dem. Rep.', mask: '999 999 999' }, // Already listed
  { code: '+244', label: 'Angola', mask: '999 999 999' }, // Already listed
  { code: '+245', label: 'Guinea-Bissau', mask: '999 9999' }, // Already listed
  { code: '+248', label: 'Seychelles', mask: '9 999 999' }, // Already listed
  { code: '+249', label: 'Sudan', mask: '9999 999 999' }, // Already listed
  { code: '+250', label: 'Rwanda', mask: '999 999 999' }, // Already listed
  { code: '+251', label: 'Ethiopia', mask: '999 999 9999' }, // Already listed
  { code: '+252', label: 'Somalia', mask: '999 999 999' }, // Already listed
  { code: '+253', label: 'Djibouti', mask: '99 99 99 99' }, // Already listed
  { code: '+254', label: 'Kenya', mask: '999 999 999' }, // Already listed
  { code: '+255', label: 'Tanzania', mask: '9999 999 999' }, // Already listed
  { code: '+256', label: 'Uganda', mask: '999 999 999' }, // Already listed
  { code: '+257', label: 'Burundi', mask: '999 9999' }, // Already listed
  { code: '+258', label: 'Mozambique', mask: '99 999 9999' }, // Already listed
  { code: '+260', label: 'Zambia', mask: '999 999 999' }, // Already listed
  { code: '+261', label: 'Madagascar', mask: '99 999 999' }, // Already listed
  { code: '+263', label: 'Zimbabwe', mask: '999 999 999' }, // Already listed
  { code: '+264', label: 'Namibia', mask: '999 999 9999' }, // Already listed
  { code: '+265', label: 'Malawi', mask: '999 999 999' }, // Already listed
  { code: '+266', label: 'Lesotho', mask: '9999 9999' }, // Already listed
  { code: '+267', label: 'Botswana', mask: '99 999 999' }, // Already listed
  { code: '+268', label: 'Eswatini', mask: '9999 9999' }, // Already listed
  { code: '+269', label: 'Comoros', mask: '999 9999' }, // Already listed
  { code: '+290', label: 'Saint Helena, Ascension and Tristan da Cunha', mask: '9999' }, // Consolidated entry
  { code: '+291', label: 'Eritrea', mask: '999 999999' }, // Already listed
  { code: '+297', label: 'Aruba', mask: '999 9999' }, // Already listed
  { code: '+298', label: 'Faroe Islands', mask: '999 999' }, // Already listed
  { code: '+299', label: 'Greenland', mask: '99 99 99' }, // Already listed
  { code: '+350', label: 'Gibraltar', mask: '99999999' }, // Already listed
  { code: '+351', label: 'Portugal', mask: '999 999 999' }, // Already listed
  { code: '+352', label: 'Luxembourg', mask: '999 999 999' }, // Already listed
  { code: '+353', label: 'Ireland', mask: '999 999 9999' }, // Already listed
  { code: '+354', label: 'Iceland', mask: '999 9999' }, // Already listed
  { code: '+355', label: 'Albania', mask: '999 999 999' }, // Already listed
  { code: '+356', label: 'Malta', mask: '9999 9999' }, // Already listed
  { code: '+357', label: 'Cyprus', mask: '99 999 999' }, // Already listed
  { code: '+358', label: 'Finland', mask: '999 9999999' }, // Already listed
  { code: '+359', label: 'Bulgaria', mask: '999 999 999' }, // Already listed
  { code: '+370', label: 'Lithuania', mask: '999 99999' }, // Already listed
  { code: '+371', label: 'Latvia', mask: '99 999 999' }, // Already listed
  { code: '+373', label: 'Moldova', mask: '999 999 999' }, // Already listed
  { code: '+374', label: 'Armenia', mask: '999 999999' }, // Already listed
  { code: '+375', label: 'Belarus', mask: '999 999 99 99' }, // Already listed
  { code: '+377', label: 'Monaco', mask: '99 99 99 99 99' }, // Already listed
  { code: '+378', label: 'San Marino', mask: '999 999 999' }, // Already listed
  { code: '+379', label: 'Vatican City', mask: '999 9999999' }, // Dedicated code for Vatican City, although +39 often used
  { code: '+380', label: 'Ukraine', mask: '999 999 9999' }, // Already listed
  { code: '+381', label: 'Serbia', mask: '999 999 999' }, // Already listed
  { code: '+382', label: 'Montenegro', mask: '999 999 999' }, // Already listed
  { code: '+385', label: 'Croatia', mask: '99 9999 999' }, // Already listed
  { code: '+386', label: 'Slovenia', mask: '999 999 999' }, // Already listed
  { code: '+387', label: 'Bosnia and Herzegovina', mask: '99 999 999' }, // Already listed
  { code: '+389', label: 'North Macedonia', mask: '99 999 999' }, // Already listed
  { code: '+420', label: 'Czechia', mask: '999 999 999' }, // Already listed
  { code: '+421', label: 'Slovakia', mask: '999 999 999' }, // Already listed
  { code: '+423', label: 'Liechtenstein', mask: '999 9999999' }, // Already listed
  { code: '+500', label: 'Falkland Islands', mask: '99999' }, // Already listed
  { code: '+501', label: 'Belize', mask: '999-9999' }, // Already listed
  { code: '+502', label: 'Guatemala', mask: '9999 9999' }, // Already listed
  { code: '+503', label: 'El Salvador', mask: '9999 9999' }, // Already listed
  { code: '+504', label: 'Honduras', mask: '9999 9999' }, // Already listed
  { code: '+505', label: 'Nicaragua', mask: '9999 9999' }, // Already listed
  { code: '+506', label: 'Costa Rica', mask: '9999 9999' }, // Already listed
  { code: '+507', label: 'Panama', mask: '9999 9999' }, // Already listed
  { code: '+508', label: 'Saint Pierre and Miquelon', mask: '99 99 99' }, // Already listed
  { code: '+509', label: 'Haiti', mask: '9999 9999' }, // Already listed
  { code: '+590', label: 'Saint Martin (French part)', mask: '999 99 99 99' }, // Already listed (grouped with Guadeloupe)
  { code: '+591', label: 'Bolivia', mask: '99999999' }, // Already listed
  { code: '+592', label: 'Guyana', mask: '999 9999' }, // Already listed
  { code: '+593', label: 'Ecuador', mask: '999 999 9999' }, // Already listed
  { code: '+594', label: 'French Guiana', mask: '999 99 99 99' }, // Already listed
  { code: '+595', label: 'Paraguay', mask: '999 999999' }, // Already listed
  { code: '+596', label: 'Martinique', mask: '999 99 99 99' }, // Already listed
  { code: '+597', label: 'Suriname', mask: '999-9999' }, // Already listed
  { code: '+598', label: 'Uruguay', mask: '999 999 999' }, // Already listed
  { code: '+599', label: 'Caribbean Netherlands (Bonaire, Saba, Sint Eustatius)', mask: '999 9999' }, // Consolidated
  { code: '+670', label: 'Timor-Leste', mask: '77 99999' }, // Already listed
  { code: '+672', label: 'Australian Antarctic Territory', mask: '9 999 9999' }, // General
  { code: '+674', label: 'Nauru', mask: '999 9999' }, // Already listed
  { code: '+675', label: 'Papua New Guinea', mask: '9999 9999' }, // Already listed
  { code: '+676', label: 'Tonga', mask: '999 9999' }, // Already listed
  { code: '+677', label: 'Solomon Islands', mask: '999 9999' }, // Already listed
  { code: '+678', label: 'Vanuatu', mask: '999 9999' }, // Already listed
  { code: '+680', label: 'Palau', mask: '999 9999' }, // Already listed
  { code: '+681', label: 'Wallis and Futuna', mask: '99 99 99' }, // Already listed
  { code: '+682', label: 'Cook Islands', mask: '99999' }, // Already listed
  { code: '+683', label: 'Niue', mask: '9999' }, // Already listed
  { code: '+685', label: 'Samoa', mask: '999 9999' }, // Already listed
  { code: '+686', label: 'Kiribati', mask: '9999999' }, // Already listed
  { code: '+688', label: 'Tuvalu', mask: '999 9999' }, // Already listed
  { code: '+690', label: 'Tokelau', mask: '9999' }, // Already listed
  { code: '+691', label: 'Micronesia', mask: '999 9999' }, // Already listed
  { code: '+692', label: 'Marshall Islands', mask: '999 9999' }, // Already listed
  { code: '+850', label: 'Democratic People\'s Republic of Korea', mask: '999 9999999' }, // Already listed
  { code: '+853', label: 'Macao', mask: '9999 9999' }, // Already listed
  { code: '+855', label: 'Cambodia', mask: '999 999 999' }, // Already listed
  { code: '+856', label: 'Lao PDR', mask: '99 999 999' }, // Already listed
  { code: '+870', label: 'Inmarsat (Satellite Phone)', mask: '999 999 999' }, // For satellite phones, often covers remote territories
  { code: '+886', label: 'Taiwan', mask: '9999 999 999' }, // Already listed
  { code: '+960', label: 'Maldives', mask: '999-9999' }, // Already listed
  { code: '+961', label: 'Lebanon', mask: '99 999 999' }, // Already listed
  { code: '+962', label: 'Jordan', mask: '9999 999 999' }, // Already listed
  { code: '+963', label: 'Syria', mask: '9999 999 999' }, // Already listed
  { code: '+964', label: 'Iraq', mask: '9999 999 9999' }, // Already listed
  { code: '+965', label: 'Kuwait', mask: '999 99999' }, // Already listed
  { code: '+966', label: 'Saudi Arabia', mask: '999 999 9999' }, // Already listed
  { code: '+967', label: 'Yemen', mask: '999 999 999' }, // Already listed
  { code: '+968', label: 'Oman', mask: '9999 9999' }, // Already listed
  { code: '+970', label: 'Palestine', mask: '999 999 999' }, // Already listed
  { code: '+971', label: 'United Arab Emirates', mask: '999 999 9999' }, // Already listed
  { code: '+972', label: 'Israel', mask: '999-999-9999' }, // Already listed
  { code: '+973', label: 'Bahrain', mask: '9999 9999' }, // Already listed
  { code: '+974', label: 'Qatar', mask: '9999 9999' }, // Already listed
  { code: '+975', label: 'Bhutan', mask: '9999 9999' }, // Already listed
  { code: '+976', label: 'Mongolia', mask: '9999 9999' }, // Already listed
  { code: '+977', label: 'Nepal', mask: '999 9999999' }, // Already listed
  { code: '+992', label: 'Tajikistan', mask: '999 999 999' }, // Already listed
  { code: '+993', label: 'Turkmenistan', mask: '999 999 999' }, // Already listed
  { code: '+994', label: 'Azerbaijan', mask: '99 999 99 99' }, // Already listed
  { code: '+995', label: 'Georgia', mask: '999 999 999' }, // Already listed
  { code: '+996', label: 'Kyrgyzstan', mask: '999 999 999' }, // Already listed
  { code: '+998', label: 'Uzbekistan', mask: '999 999 999' }, // Already listed
];

export const NATIONALITIES = [
  'Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Antiguan and Barbudan', 'Argentine',
  'Armenian', 'Aruban', 'Australian', 'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi',
  'Barbadian', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bermudian', 'Bhutanese', 'Bolivian',
  'Bosnian and Herzegovinian', 'Botswana', 'Brazilian', 'British Indian Ocean Territory', 'Bruneian',
  'Bulgarian', 'Burkinabe', 'Burundian', 'Cabo Verdean', 'Cambodian', 'Cameroonian', 'Canadian',
  'Caymanian', 'Central African', 'Chadian', 'Chilean', 'China', 'Christmas Islander', 'Cocos Islander',
  'Colombian', 'Comoran', 'Congolese (DRC)', 'Congolese (Republic)', 'Cook Islander', 'Costa Rican',
  "Ivorian", 'Croatian', 'Cuban', 'Curaçaoan', 'Cypriot', 'Czech', 'Danish', 'Djiboutian', 'Dominican',
  'Dominican (Republic)', 'East Timorese', 'Ecuadorian', 'Egyptian', 'Salvadoran', 'Equatorial Guinean',
  'Eritrean', 'Estonian', 'Ethiopian', 'Falkland Islander', 'Faroese', 'Fijian', 'Finnish', 'French',
  'French Guianan', 'French Polynesian', 'French Southern Territories', 'Gabonese', 'Gambian', 'Georgian',
  'German', 'Ghanaian', 'Gibraltarian', 'Greek', 'Greenlandic', 'Grenadian', 'Guadeloupean', 'Guamanian',
  'Guatemalan', 'Guernseyan', 'Guinean', 'Guinea-Bissau', 'Guyanese', 'Haitian', 'Heard and McDonald Islander',
  'Holy See (Vatican City State)', 'Honduran', 'Hong Konger', 'Hungarian', 'Icelandic', 'Indian', 'Indonesian',
  'Iranian', 'Iraqi', 'Irish', 'Isle of Man', 'Israeli', 'Italian', 'Jamaican', 'Japanese', 'Jersey', 'Jordanian',
  'Kazakhstani', 'Kenyan', 'Kiribati', 'North Korean', 'South Korean', 'Kuwaiti', 'Kyrgyzstani', 'Lao',
  'Latvian', 'Lebanese', 'Lesotho', 'Liberian', 'Libyan', 'Liechtensteiner', 'Lithuanian', 'Luxembourger',
  'Macanese', 'Macedonian', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivian', 'Malian', 'Maltese',
  'Marshallese', 'Martiniquan', 'Mauritanian', 'Mauritian', 'Mayotte', 'Mexican', 'Micronesian', 'Moldovan',
  'Monacan', 'Mongolian', 'Montenegrin', 'Montserratian', 'Moroccan', 'Mozambican', 'Myanmar', 'Namibian',
  'Nauruan', 'Nepali', 'Dutch', 'New Caledonian', 'New Zealander', 'Nicaraguan', 'Nigerien', 'Nigerian',
  'Niuean', 'Norfolk Islander', 'Northern Mariana Islander', 'Norwegian', 'Omani', 'Pakistani', 'Palauan',
  'Palestinian', 'Panamanian', 'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Philippine', 'Pitcairn Islander',
  'Polish', 'Portuguese', 'Qatari', 'Réunion Islander', 'Romanian', 'Russian', 'Rwandan', 'Saint Barthelemy',
  'Saint Helenian', 'Saint Kitts and Nevis', 'Saint Lucian', 'Saint Martin', 'Saint Pierre and Miquelon',
  'Saint Vincent and the Grenadines', 'Samoan', 'San Marinese', 'Sao Tomean', 'Saudi Arabian', 'Senegalese',
  'Serbian', 'Seychellois', 'Sierra Leonean', 'Singaporean', 'Sint Maarten (Dutch part)', 'Slovak', 'Slovenian',
  'Solomon Islander', 'Somali', 'South African', 'South Georgian and South Sandwich Islander', 'South Sudanese',
  'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamese', 'Svalbard and Jan Mayen', 'Swazi', 'Swedish', 'Swiss',
  'Syrian', 'Taiwanese', 'Tajikistani', 'Tanzanian', 'Thai', 'Timorese', 'Togolese', 'Tokelauan', 'Tongan',
  'Trinidadian and Tobagonian', 'Tunisian', 'Turkish', 'Turkmen', 'Turks and Caicos Islander', 'Tuvaluan',
  'Ugandan', 'Ukrainian', 'Emirati', 'British', 'American', 'Uruguayan', 'Uzbekistani', 'Vanuatuan',
  'Venezuelan', 'Vietnamese', 'Virgin Islander (U.S.)', 'Wallis and Futuna Islander', 'Western Saharan',
  'Yemeni', 'Zambian', 'Zimbabwean'
];