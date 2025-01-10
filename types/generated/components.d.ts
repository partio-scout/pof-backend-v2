import type { Attribute, Schema } from '@strapi/strapi';

export interface BlocksActivityBlock extends Schema.Component {
  collectionName: 'components_blocks_activity_blocks';
  info: {
    description: '';
    displayName: 'Activity Block';
    icon: 'atlas';
  };
  attributes: {
    activities: Attribute.Relation<
      'blocks.activity-block',
      'oneToMany',
      'api::activity.activity'
    >;
    block_width: Attribute.Relation<
      'blocks.activity-block',
      'oneToOne',
      'api::block-width.block-width'
    >;
  };
}

export interface BlocksAgeGroupBlock extends Schema.Component {
  collectionName: 'components_blocks_age_group_blocks';
  info: {
    displayName: 'Age Group Block';
    icon: 'address-book';
  };
  attributes: {
    block_width: Attribute.Relation<
      'blocks.age-group-block',
      'oneToOne',
      'api::block-width.block-width'
    >;
    ingress: Attribute.RichText;
    title: Attribute.String;
  };
}

export interface BlocksContentPageBlock extends Schema.Component {
  collectionName: 'components_blocks_content_page_blocks';
  info: {
    displayName: 'Content Page Block';
    icon: 'ad';
  };
  attributes: {
    block_width: Attribute.Relation<
      'blocks.content-page-block',
      'oneToOne',
      'api::block-width.block-width'
    >;
    content_pages: Attribute.Relation<
      'blocks.content-page-block',
      'oneToMany',
      'api::content-page.content-page'
    >;
  };
}

export interface BlocksHeroBlock extends Schema.Component {
  collectionName: 'components_content_hero_blocks';
  info: {
    description: '';
    displayName: 'Highlight Block';
    icon: 'image';
  };
  attributes: {
    background: Attribute.Media<'images'>;
    link_text: Attribute.String;
    link_url: Attribute.String;
    text: Attribute.Text;
    title: Attribute.String;
  };
}

export interface BlocksImageBlock extends Schema.Component {
  collectionName: 'components_content_image_blocks';
  info: {
    displayName: 'Image Block';
    icon: 'file-image';
  };
  attributes: {
    block_width: Attribute.Relation<
      'blocks.image-block',
      'oneToOne',
      'api::block-width.block-width'
    >;
    image: Attribute.Media<'images'>;
  };
}

export interface BlocksLinkBlock extends Schema.Component {
  collectionName: 'components_blocks_link_blocks';
  info: {
    displayName: 'Link Block';
    icon: 'link';
  };
  attributes: {
    block_width: Attribute.Relation<
      'blocks.link-block',
      'oneToOne',
      'api::block-width.block-width'
    >;
    text: Attribute.String;
    url: Attribute.String;
  };
}

export interface BlocksTextBlock extends Schema.Component {
  collectionName: 'components_content_text_blocks';
  info: {
    description: '';
    displayName: 'Text block';
    icon: 'text-height';
  };
  attributes: {
    block_width: Attribute.Relation<
      'blocks.text-block',
      'oneToOne',
      'api::block-width.block-width'
    >;
    text: Attribute.RichText;
    title: Attribute.String;
  };
}

export interface BlocksVideoBlock extends Schema.Component {
  collectionName: 'components_blocks_video_blocks';
  info: {
    description: '';
    displayName: 'Video block';
    icon: 'photo-video';
  };
  attributes: {
    block_width: Attribute.Relation<
      'blocks.video-block',
      'oneToOne',
      'api::block-width.block-width'
    >;
    video: Attribute.Media<'videos'>;
    video_url: Attribute.String;
  };
}

export interface FooterFooterSection extends Schema.Component {
  collectionName: 'components_footer_footer_sections';
  info: {
    displayName: 'Footer section';
    icon: 'th-large';
  };
  attributes: {
    link_groups: Attribute.Component<'footer.link-group', true>;
    title: Attribute.Text;
  };
}

export interface FooterLink extends Schema.Component {
  collectionName: 'components_footer_link';
  info: {
    description: '';
    displayName: 'Link';
    icon: 'external-link-alt';
  };
  attributes: {
    description: Attribute.Text;
    email: Attribute.String;
    phone_number: Attribute.String;
    title: Attribute.String;
    url: Attribute.String;
  };
}

export interface FooterLinkGroup extends Schema.Component {
  collectionName: 'components_footer_link_groups';
  info: {
    displayName: 'LinkGroup';
    icon: 'align-justify';
  };
  attributes: {
    links: Attribute.Component<'footer.link', true>;
    some_links: Attribute.Component<'footer.some-links'>;
  };
}

export interface FooterSomeLinks extends Schema.Component {
  collectionName: 'components_footer_some_links';
  info: {
    displayName: 'some_links';
    icon: 'at';
  };
  attributes: {
    facebook_url: Attribute.String;
    instagram_url: Attribute.String;
    twitter_url: Attribute.String;
    youtube_url: Attribute.String;
  };
}

export interface FooterText extends Schema.Component {
  collectionName: 'components_footer_texts';
  info: {
    displayName: 'text';
    icon: 'align-center';
  };
  attributes: {
    text: Attribute.Text;
  };
}

export interface LinksLink extends Schema.Component {
  collectionName: 'components_links_link';
  info: {
    description: '';
    displayName: 'Link';
    icon: 'external-link-alt';
  };
  attributes: {
    description: Attribute.String;
    icon: Attribute.Media<'images' | 'files' | 'videos'>;
    url: Attribute.String;
  };
}

export interface NavigationNavigation extends Schema.Component {
  collectionName: 'components_navigation_navigations';
  info: {
    description: 'Here you can create the sites navigation';
    displayName: 'Navigation';
    icon: 'bars';
  };
  attributes: {
    subnavigation: Attribute.Component<'navigation.subnavigation', true>;
    title: Attribute.String & Attribute.Required;
  };
}

export interface NavigationSubnavigation extends Schema.Component {
  collectionName: 'components_navigation_subnavigations';
  info: {
    description: '';
    displayName: 'subnavigation';
    icon: 'bars';
  };
  attributes: {
    page: Attribute.Relation<
      'navigation.subnavigation',
      'oneToOne',
      'api::content-page.content-page'
    >;
    subnavigation: Attribute.Component<'navigation.subsubnavigation', true>;
    title: Attribute.String & Attribute.Required;
  };
}

export interface NavigationSubsubnavigation extends Schema.Component {
  collectionName: 'components_navigation_subsubnavigations';
  info: {
    description: '';
    displayName: 'subsubnavigation';
    icon: 'bars';
  };
  attributes: {
    page: Attribute.Relation<
      'navigation.subsubnavigation',
      'oneToOne',
      'api::content-page.content-page'
    >;
    title: Attribute.String & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'blocks.activity-block': BlocksActivityBlock;
      'blocks.age-group-block': BlocksAgeGroupBlock;
      'blocks.content-page-block': BlocksContentPageBlock;
      'blocks.hero-block': BlocksHeroBlock;
      'blocks.image-block': BlocksImageBlock;
      'blocks.link-block': BlocksLinkBlock;
      'blocks.text-block': BlocksTextBlock;
      'blocks.video-block': BlocksVideoBlock;
      'footer.footer-section': FooterFooterSection;
      'footer.link': FooterLink;
      'footer.link-group': FooterLinkGroup;
      'footer.some-links': FooterSomeLinks;
      'footer.text': FooterText;
      'links.link': LinksLink;
      'navigation.navigation': NavigationNavigation;
      'navigation.subnavigation': NavigationSubnavigation;
      'navigation.subsubnavigation': NavigationSubsubnavigation;
    }
  }
}
