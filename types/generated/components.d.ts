import type { Schema, Attribute } from '@strapi/strapi';

export interface BlocksActivityBlock extends Schema.Component {
  collectionName: 'components_blocks_activity_blocks';
  info: {
    icon: 'atlas';
    description: '';
    displayName: 'Activity Block';
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
    icon: 'address-book';
    displayName: 'Age Group Block';
  };
  attributes: {
    title: Attribute.String;
    ingress: Attribute.RichText;
    block_width: Attribute.Relation<
      'blocks.age-group-block',
      'oneToOne',
      'api::block-width.block-width'
    >;
  };
}

export interface BlocksContentPageBlock extends Schema.Component {
  collectionName: 'components_blocks_content_page_blocks';
  info: {
    icon: 'ad';
    displayName: 'Content Page Block';
  };
  attributes: {
    content_pages: Attribute.Relation<
      'blocks.content-page-block',
      'oneToMany',
      'api::content-page.content-page'
    >;
    block_width: Attribute.Relation<
      'blocks.content-page-block',
      'oneToOne',
      'api::block-width.block-width'
    >;
  };
}

export interface BlocksHeroBlock extends Schema.Component {
  collectionName: 'components_content_hero_blocks';
  info: {
    icon: 'image';
    description: '';
    displayName: 'Highlight Block';
  };
  attributes: {
    title: Attribute.String;
    text: Attribute.Text;
    background: Attribute.Media;
    link_text: Attribute.String;
    link_url: Attribute.String;
  };
}

export interface BlocksImageBlock extends Schema.Component {
  collectionName: 'components_content_image_blocks';
  info: {
    icon: 'file-image';
    displayName: 'Image Block';
  };
  attributes: {
    image: Attribute.Media;
    block_width: Attribute.Relation<
      'blocks.image-block',
      'oneToOne',
      'api::block-width.block-width'
    >;
  };
}

export interface BlocksLinkBlock extends Schema.Component {
  collectionName: 'components_blocks_link_blocks';
  info: {
    icon: 'link';
    displayName: 'Link Block';
  };
  attributes: {
    text: Attribute.String;
    url: Attribute.String;
    block_width: Attribute.Relation<
      'blocks.link-block',
      'oneToOne',
      'api::block-width.block-width'
    >;
  };
}

export interface BlocksTextBlock extends Schema.Component {
  collectionName: 'components_content_text_blocks';
  info: {
    icon: 'text-height';
    description: '';
    displayName: 'Text block';
  };
  attributes: {
    title: Attribute.String;
    text: Attribute.RichText;
    block_width: Attribute.Relation<
      'blocks.text-block',
      'oneToOne',
      'api::block-width.block-width'
    >;
  };
}

export interface BlocksVideoBlock extends Schema.Component {
  collectionName: 'components_blocks_video_blocks';
  info: {
    icon: 'photo-video';
    description: '';
    displayName: 'Video block';
  };
  attributes: {
    video: Attribute.Media;
    block_width: Attribute.Relation<
      'blocks.video-block',
      'oneToOne',
      'api::block-width.block-width'
    >;
    video_url: Attribute.String;
  };
}

export interface FooterFooterSection extends Schema.Component {
  collectionName: 'components_footer_footer_sections';
  info: {
    icon: 'th-large';
    displayName: 'Footer section';
  };
  attributes: {
    link_groups: Attribute.Component<'footer.link-group', true>;
    title: Attribute.Text;
  };
}

export interface FooterLinkGroup extends Schema.Component {
  collectionName: 'components_footer_link_groups';
  info: {
    icon: 'align-justify';
    displayName: 'LinkGroup';
  };
  attributes: {
    links: Attribute.Component<'footer.link', true>;
    some_links: Attribute.Component<'footer.some-links'>;
  };
}

export interface FooterLink extends Schema.Component {
  collectionName: 'components_footer_link';
  info: {
    icon: 'external-link-alt';
    description: '';
    displayName: 'Link';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.Text;
    url: Attribute.String;
    phone_number: Attribute.String;
    email: Attribute.String;
  };
}

export interface FooterSomeLinks extends Schema.Component {
  collectionName: 'components_footer_some_links';
  info: {
    icon: 'at';
    displayName: 'some_links';
  };
  attributes: {
    facebook_url: Attribute.String;
    twitter_url: Attribute.String;
    instagram_url: Attribute.String;
    youtube_url: Attribute.String;
  };
}

export interface FooterText extends Schema.Component {
  collectionName: 'components_footer_texts';
  info: {
    icon: 'align-center';
    displayName: 'text';
  };
  attributes: {
    text: Attribute.Text;
  };
}

export interface LinksLink extends Schema.Component {
  collectionName: 'components_links_link';
  info: {
    icon: 'external-link-alt';
    description: '';
    displayName: 'Link';
  };
  attributes: {
    description: Attribute.String;
    url: Attribute.String;
    icon: Attribute.Media;
  };
}

export interface NavigationNavigation extends Schema.Component {
  collectionName: 'components_navigation_navigations';
  info: {
    icon: 'bars';
    description: 'Here you can create the sites navigation';
    displayName: 'Navigation';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    subnavigation: Attribute.Component<'navigation.subnavigation', true>;
  };
}

export interface NavigationSubnavigation extends Schema.Component {
  collectionName: 'components_navigation_subnavigations';
  info: {
    icon: 'bars';
    description: '';
    displayName: 'subnavigation';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    page: Attribute.Relation<
      'navigation.subnavigation',
      'oneToOne',
      'api::content-page.content-page'
    >;
    subnavigation: Attribute.Component<'navigation.subsubnavigation', true>;
  };
}

export interface NavigationSubsubnavigation extends Schema.Component {
  collectionName: 'components_navigation_subsubnavigations';
  info: {
    icon: 'bars';
    description: '';
    displayName: 'subsubnavigation';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    page: Attribute.Relation<
      'navigation.subsubnavigation',
      'oneToOne',
      'api::content-page.content-page'
    >;
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
      'footer.link-group': FooterLinkGroup;
      'footer.link': FooterLink;
      'footer.some-links': FooterSomeLinks;
      'footer.text': FooterText;
      'links.link': LinksLink;
      'navigation.navigation': NavigationNavigation;
      'navigation.subnavigation': NavigationSubnavigation;
      'navigation.subsubnavigation': NavigationSubsubnavigation;
    }
  }
}
