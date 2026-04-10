import burgerImage from '../assets/images/burger_nobg.webp'
import espressoImage from '../assets/images/espresso.webp'
import friesImage from '../assets/images/fries_nobg.webp'
import kopiSusuGulaArenImage from '../assets/images/kopi-susu-gula-aren.webp'
import onionRingImage from '../assets/images/onion-ring_nobg.webp'
import pourOverImage from '../assets/images/pour-over.webp'
import skenaNightBloomImage from '../assets/images/skena-night-bloom.webp'
import spagetthiImage from '../assets/images/spagetthi_nobg.webp'

const menuCategories = [
  {
    id: 'drinks',
    label: 'Drinks',
    items: [
      {
        id: 'espresso',
        name: 'Espresso',
        price: '30k',
        profile: 'Bold / Dark Chocolate / Citrus',
        description:
          'Pulled short and intentional with a dense crema. The cup opens with dark cocoa and finishes with a clean citrus lift.',
        label: 'House Classic',
        image: espressoImage,
      },
      {
        id: 'pour-over',
        name: 'Pour Over',
        price: '42k',
        profile: 'Floral / Tea-like / Bright',
        description:
          'Single-origin selection brewed by hand using a controlled spiral pour, revealing delicate aromatics and a crisp finish.',
        label: 'Manual Brew',
        image: pourOverImage,
      },
      {
        id: 'kopi-susu-aren',
        name: 'Kopi Susu Aren',
        price: '38k',
        profile: 'Palm Sugar / Creamy / Roasted',
        description:
          'Skena signature blend with West Javanese aren sugar and fresh milk, balancing sweetness and deep roasted character.',
        label: 'Bandung Favorite',
        image: kopiSusuGulaArenImage,
      },
      {
        id: 'skena-night-bloom',
        name: 'Skena Night Bloom',
        price: '45k',
        profile: 'Berry / Spice / Velvet',
        description:
          'A rotating seasonal creation built from anaerobic micro-lots, steamed milk, and a subtle clove-orange finish.',
        label: 'Signature Series',
        image: skenaNightBloomImage,
      },
    ],
  },
  {
    id: 'foods',
    label: 'Foods',
    items: [
      {
        id: 'midnight-smash',
        name: 'Midnight Smash Burger',
        price: '68k',
        profile: 'Beef Jus / Smoked Onion / Sharp Cheddar',
        description:
          'Double-seared beef layered with sharp cheddar, onion jam, and black pepper mayo on a butter-toasted milk bun for a rich late-night bite.',
        label: 'House Favorite',
        image: burgerImage,
      },
      {
        id: 'sea-salt-fries',
        name: 'Sea Salt Truffle Fries',
        price: '34k',
        profile: 'Golden / Truffle Salt / Crisp',
        description:
          'Thick-cut fries finished with truffle sea salt and roasted garlic aioli, built for slow coffee sessions and easy sharing.',
        label: 'All-Day Snack',
        image: friesImage,
      },
      {
        id: 'bronze-onion-rings',
        name: 'Bronze Onion Rings',
        price: '36k',
        profile: 'Buttermilk / Pepper / Crunch',
        description:
          'Sweet onion ribbons dipped in a light buttermilk batter and fried until bronze, served with a warm paprika-honey dip.',
        label: 'Seasonal',
        image: onionRingImage,
      },
      {
        id: 'roasted-tomato-spagetthi',
        name: 'Roasted Tomato Spagetthi',
        price: '58k',
        profile: 'Slow Tomato / Basil / Parmesan',
        description:
          'A silky tomato reduction tossed through spagetthi with basil oil and parmesan, delivering a clean savory finish with subtle sweetness.',
        label: 'Chef Pick',
        image: spagetthiImage,
      },
    ],
  },
]

export default menuCategories
