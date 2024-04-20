import { extendTheme, defineStyle, defineStyleConfig } from '@chakra-ui/react';

const fontFamily = `'Lufga', sans-serif`;

const fonts = {
  body: fontFamily,
  heading: fontFamily,
};

const menuBaseStyle = defineStyle({
  list: {
    bg: "white",
    border: 'none',
    shadow: 'md'
  },
  item: {
    color: "var(--text-color)",
    bg: "white",
    _hover: {
      bg: "gray.50",
      color: 'black'
    },
    _focus: {
      bg: "gray.50",
      opacity: '0.8'
    },
    _active: {
      bg: 'gray.50'
    }
  },
});

// const { definePartsStyle, defineMultiStyleConfig } =
//   createMultiStyleConfigHelpers(switchAnatomy.keys)

// const baseStyle = definePartsStyle({
//   thumb: {
//     bg: 'red.500',
//     _checked: {
//       bg: 'gray.50'
//     }
//   },
//   track: {
//     bg: 'gray.100',
//     _checked: {
//       bg: 'red.500',
//     },
//   },
// })

// export const switchTheme = defineMultiStyleConfig({ baseStyle })

const components = {
  Input: {
    variants: {
      outline: {
        field: {
          bg: 'transparent',
          color: 'white',
          fontWeight: '400',
          _placeholder: {
            color: 'white',
            fontWeight: '200',
          },
          _focus: {
            boxShadow: 'none',
            outline: 'none',
            borderColor: 'white',
          },
          _invalid: {
            borderColor: 'red.200',
          },
        },
      },
      filled: {
        field: {
          bg: 'gray.50',
          color: 'black',
          _hover: {
            bg: 'gray.50',
            shadow: 'sm'
          }
        }
      },
      search: {
        field: {
          bg: 'rgba(248, 249, 250, 1)',
        }
      },
      chat: {
        field: {
          bg: 'rgba(238, 238, 238, 1)',
          py: 8,
          rounded: 'none'
        }
      }
    },
  },
  Table: {
    variants: {
      simple: {
        th: {
          padding: '1rem',
          color: '#343A40',
          borderBottom: '2px solid rgba(223, 223, 223, 1)'
        },
        td: {
          whiteSpace: 'nowrap',
          color: '#6C757D',
          py: 3
        },
      },
      'simple-center': {
        th: {
          textAlign: 'center',
          padding: '1rem',
          color: '#343A40',
          borderBottom: '2px solid rgba(223, 223, 223, 1)'
        },
        td: {
          textAlign: 'center',
          whiteSpace: 'nowrap',
          color: '#6C757D',
          py: 3
        },
      },
      pagination: {
        th: {
          textAlign: 'center',
          padding: '1rem',
          color: '#343A40',
          fontWeight: 600,
          borderBottom: '2px solid rgba(223, 223, 223, 1)'
        },
        td: {
          textAlign: 'center',
          color: '#6C757D',
          bg: 'white'
        }
      }
    }
  },
  Button: {
    variants: {
      red: {
        bg: 'var(--red-grad)',
        color: 'white',
        fontSize: '1rem',
        fontWeight: '400',
        _hover: {
          opacity: '0.9',
        },
        _active: {
          opacity: '0.8',
        },
      },
      gray: {
        bg: 'gray.200',
        color: 'white',
        fontSize: '1rem',
        fontWeight: '400',
        _hover: {
          opacity: '0.9'
        },
        _active: {
          opacity: '0.8'
        }
      },
      white: {
        bg: 'white',
        color: 'black',
        fontSize: '1rem',
        fontWeight: '400',
        shadow: 'sm',
        _hover: {
          opacity: '0.8',
          shadow: 'md'
        },
        _active: {
          opacity: '0.9',
          shadow: 'lg'
        }
      },
      greenish: {
        bg: '#4CE5B1',
        color: 'black',
        fontSize: '1rem',
        fontWeight: '400',
        _hover: {
          opacity: 0.9
        },
        _active: {
          opacity: 0.8
        }
      }
    },
  },
  Menu: defineStyleConfig({ baseStyle: menuBaseStyle }),
  // Switch: switchTheme
};

export const colors = {
  blue: {
    500: 'rgba(50, 166, 249, 1)',
  },
  red: {
    500: '#E71B40',
  },
  green: {
    500: '#28A745',
  },
  blackAlpha: {
    500: '#030303',
    600: '#030304DB',
  },
  gray: {
    50: 'rgba(244, 244, 245, 1)',
    200: '#898989'
  },
  orange: {
    100: '#E33629',
    800: 'white'
  },
  light: {
    100: 'rgba(217, 217, 217, 0.10)'
  }
};

const theme = extendTheme({
  fonts,
  colors,
  components,
  // switchTheme
});

export default theme;


/*
  Appendix:
    * Switches: https://chakra-ui.com/docs/components/switch/theming
*/