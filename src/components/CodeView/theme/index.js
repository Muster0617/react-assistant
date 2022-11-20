// Original: https://raw.githubusercontent.com/PrismJS/prism-themes/master/themes/prism-ghcolors.css
var theme = {
  plain: {
    color: '#000',
    backgroundColor: '#f6f8fa',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: '#999988',
        fontStyle: 'italic',
      },
    },
    {
      types: ['namespace'],
      style: {
        opacity: 0.7,
      },
    },
    {
      types: ['string', 'attr-name'],
      style: {
        color: '#690',
      },
    },
    {
      types: ['punctuation', 'operator'],
      style: {
        color: '#999',
      },
    },
    {
      types: [
        'entity',
        'url',
        'symbol',
        'number',
        'boolean',
        'variable',
        'constant',
        'regex',
        'inserted',
      ],
      style: {
        color: '#905',
      },
    },
    {
      types: ['atrule', 'keyword', 'selector'],
      style: {
        color: '#07a',
      },
    },
    {
      types: ['function', 'deleted'],
      style: {
        color: '#d73a49',
      },
    },
    {
      types: ['function-variable'],
      style: {
        color: '#dd4a68',
      },
    },
    {
      types: ['tag', 'selector'],
      style: {
        color: '#905',
      },
    },
    {
      types: ['literal-property'],
      style: {
        color: '#000',
      },
    },
    {
      types: ['token-line'],
      style: {
        color: '#000',
      },
    },
    {
      types: ['attr-value'],
      style: {
        color: '#07a',
      },
    },
    {
      types: ['maybe-class-name'],
      style: {
        color: '#dd4a68',
      },
    },
    {
      types: ['class-name'],
      style: {
        color: '#dd4a68',
      },
    },
  ],
};

export default theme;
