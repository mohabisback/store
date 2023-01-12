const navItems = [
  
  {
    url: '/',
    title: 'Home',
    icon: 'house-chimney'
  },
  {
    url: '/Restaurants',
    title: 'Restaurants',
    icon: 'utensils'
  },
  {
    url: '/about',
    title: 'About',
    icon: 'circle-info',
    submenu: [
      {
        title: 'Email',
        url: 'php',
        icon: 'envelope-open-text'
      },
      {
        title: 'Links',
        url: '/link',
        icon: 'link',    
        submenu: [
          {
            title: 'Linked-In',
            url: '/linkedin',
            icon: ['fab', 'linkedin']
          },
          {
            title: 'Github',
            url: '/github',
            icon: ['fab', 'github']
          },
          {
            title: 'Facebook',
            url: '/facebook',
            icon: ['fab', 'facebook']
          },
          {
            title: 'Twitter',
            url: '/twitter',
            icon: ['fab', 'twitter']
          },
          {
            title: 'Youtube',
            url: '/youtube',
            icon: ['fab', 'youtube']
          },
          {
            title: 'Wordpress',
            url: '/wordpress',
            icon: ['fab', 'wordpress']
          },
        ]
      },
    ],
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: 'diagram-project',
    submenu: [
      {
        title: 'web design',
        url: 'web-design',
      },
      {
        title: 'web development',
        url: 'web-dev',
        submenu: [
          {
            title: 'Frontend',
            url: 'frontend',
          },
          {
            title: 'Backend',
            submenu: [
              {
                title: 'NodeJS',
                url: 'node',
              },
              {
                title: 'PHP',
                url: 'php',
              },
            ],
          },
        ],
      },
      {
        title: 'SEO',
        url: 'seo',
      },
    ],
  },
]
export default navItems