// app/(painelpersonalizado)/personalizar/templates/Velvete.ts
import { Tema } from '../components/EditorContext';
import { baseTema } from './baseTema';

export const Velvete: Tema = {
  ...baseTema,
  cores: {
    ...baseTema.cores,
    primaria: '#845EC2',
    secundaria: '#D65DB1',
  },
  homePageModules: [
    {
      id: 'velvete_banner',
      label: 'Banner Velvete',
      icon: 'MdImage',
      type: 'banner',
      isVisible: true,
      config: {
        title: 'Velvete Collection',
        bannerLayoutType: 'full_width',
        banners: [
          {
            id: 'b1',
            imageUrlDesktop: 'https://placehold.co/800x250/845EC2/FFFFFF?text=Velvete+Desktop',
            imageUrlMobile: 'https://placehold.co/375x150/845EC2/FFFFFF?text=Velvete+Mobile',
            linkUrl: '#',
            altText: 'Velvete Banner',
            title: 'Nova Coleção',
            description: 'Exclusividade e sofisticação',
            buttonText: 'Veja mais'
          }
        ]
      }
    },
  ],
};
