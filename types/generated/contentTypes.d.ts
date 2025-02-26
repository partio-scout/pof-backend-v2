import type { Attribute, Schema } from '@strapi/strapi';

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    expiresAt: Attribute.DateTime;
    lastUsedAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    description: Attribute.String;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    expiresAt: Attribute.DateTime;
    lastUsedAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Attribute.String;
    registrationToken: Attribute.String & Attribute.Private;
    resetPasswordToken: Attribute.String & Attribute.Private;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    username: Attribute.String;
  };
}

export interface ApiActivityGroupCategoryActivityGroupCategory
  extends Schema.CollectionType {
  collectionName: 'activity_group_categories';
  info: {
    displayName: 'Activity-group-category';
    name: 'activity-group-category';
    pluralName: 'activity-group-categories';
    singularName: 'activity-group-category';
  };
  options: {
    draftAndPublish: false;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    activity_groups: Attribute.Relation<
      'api::activity-group-category.activity-group-category',
      'oneToMany',
      'api::activity-group.activity-group'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::activity-group-category.activity-group-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::activity-group-category.activity-group-category',
      'oneToMany',
      'api::activity-group-category.activity-group-category'
    >;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sort_order: Attribute.Integer &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::activity-group-category.activity-group-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    wp_guid: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
  };
}

export interface ApiActivityGroupActivityGroup extends Schema.CollectionType {
  collectionName: 'activity_groups';
  info: {
    description: '';
    displayName: 'Activity-group';
    name: 'activity-group';
    pluralName: 'activity-groups';
    singularName: 'activity-group';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    activities: Attribute.Relation<
      'api::activity-group.activity-group',
      'oneToMany',
      'api::activity.activity'
    >;
    activity_group_category: Attribute.Relation<
      'api::activity-group.activity-group',
      'manyToOne',
      'api::activity-group-category.activity-group-category'
    >;
    activitygroup_term: Attribute.Relation<
      'api::activity-group.activity-group',
      'oneToOne',
      'api::activitygroup-term.activitygroup-term'
    >;
    age_group: Attribute.Relation<
      'api::activity-group.activity-group',
      'manyToOne',
      'api::age-group.age-group'
    >;
    content: Attribute.RichText &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    content_area: Attribute.DynamicZone<
      [
        'blocks.text-block',
        'blocks.hero-block',
        'blocks.image-block',
        'blocks.link-block',
        'blocks.activity-block'
      ]
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::activity-group.activity-group',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    ingress: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    links: Attribute.Component<'links.link', true> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::activity-group.activity-group',
      'oneToMany',
      'api::activity-group.activity-group'
    >;
    logo: Attribute.Media<'images'>;
    main_image: Attribute.Media<'images'>;
    mandatory: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    mandatory_activities_description: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    mandatory_activities_title: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    optional_activities_description: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    optional_activities_title: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Attribute.DateTime;
    sort_order: Attribute.Integer &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    subactivity_term: Attribute.Relation<
      'api::activity-group.activity-group',
      'oneToOne',
      'api::activity-term.activity-term'
    >;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::activity-group.activity-group',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    wp_guid: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
  };
}

export interface ApiActivityLevelActivityLevel extends Schema.CollectionType {
  collectionName: 'activity_levels';
  info: {
    displayName: 'Activity-level';
    name: 'activity-level';
    pluralName: 'activity-levels';
    singularName: 'activity-level';
  };
  options: {
    comment: '';
    draftAndPublish: false;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::activity-level.activity-level',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::activity-level.activity-level',
      'oneToMany',
      'api::activity-level.activity-level'
    >;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    slug: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::activity-level.activity-level',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiActivityTermActivityTerm extends Schema.CollectionType {
  collectionName: 'activity_terms';
  info: {
    displayName: 'Activity-term';
    name: 'activity-term';
    pluralName: 'activity-terms';
    singularName: 'activity-term';
  };
  options: {
    draftAndPublish: false;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::activity-term.activity-term',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::activity-term.activity-term',
      'oneToMany',
      'api::activity-term.activity-term'
    >;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    plural: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    singular: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::activity-term.activity-term',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiActivityActivity extends Schema.CollectionType {
  collectionName: 'activities';
  info: {
    displayName: 'Activity';
    name: 'activity';
    pluralName: 'activities';
    singularName: 'activity';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    activity_group: Attribute.Relation<
      'api::activity.activity',
      'manyToOne',
      'api::activity-group.activity-group'
    >;
    activity_term: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'api::activity-term.activity-term'
    >;
    age_group: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'api::age-group.age-group'
    >;
    content: Attribute.RichText &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    duration: Attribute.Relation<
      'api::activity.activity',
      'manyToOne',
      'api::duration.duration'
    >;
    educational_objectives: Attribute.Relation<
      'api::activity.activity',
      'manyToMany',
      'api::educational-objective.educational-objective'
    >;
    equimpent: Attribute.Relation<
      'api::activity.activity',
      'oneToMany',
      'api::equipment.equipment'
    >;
    files: Attribute.Media<'files' | 'videos', true>;
    group_sizes: Attribute.Relation<
      'api::activity.activity',
      'oneToMany',
      'api::group-size.group-size'
    >;
    images: Attribute.Media<'images', true>;
    ingress: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    is_marine_activity: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    leader_skills: Attribute.Relation<
      'api::activity.activity',
      'manyToMany',
      'api::leader-skill.leader-skill'
    >;
    leader_tasks: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    level: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'api::activity-level.activity-level'
    >;
    links: Attribute.Component<'links.link', true> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::activity.activity',
      'oneToMany',
      'api::activity.activity'
    >;
    locations: Attribute.Relation<
      'api::activity.activity',
      'manyToMany',
      'api::location.location'
    >;
    logo: Attribute.Media<'images'>;
    main_image: Attribute.Media<'images'>;
    mandatory: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Attribute.DefaultTo<false>;
    preparation_duration: Attribute.Relation<
      'api::activity.activity',
      'manyToOne',
      'api::duration.duration'
    >;
    publishedAt: Attribute.DateTime;
    skill_areas: Attribute.Relation<
      'api::activity.activity',
      'manyToMany',
      'api::skill-area.skill-area'
    >;
    suggestions: Attribute.Relation<
      'api::activity.activity',
      'oneToMany',
      'api::suggestion.suggestion'
    >;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    wp_guid: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
  };
}

export interface ApiActivitygroupTermActivitygroupTerm
  extends Schema.CollectionType {
  collectionName: 'activitygroup_terms';
  info: {
    displayName: 'Activitygroup-term';
    name: 'activitygroup-term';
    pluralName: 'activitygroup-terms';
    singularName: 'activitygroup-term';
  };
  options: {
    draftAndPublish: false;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::activitygroup-term.activitygroup-term',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::activitygroup-term.activitygroup-term',
      'oneToMany',
      'api::activitygroup-term.activitygroup-term'
    >;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    plural: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    singular: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::activitygroup-term.activitygroup-term',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAgeGroupAgeGroup extends Schema.CollectionType {
  collectionName: 'age_groups';
  info: {
    displayName: 'Age-group';
    name: 'age-group';
    pluralName: 'age-groups';
    singularName: 'age-group';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    activity_groups: Attribute.Relation<
      'api::age-group.age-group',
      'oneToMany',
      'api::activity-group.activity-group'
    >;
    color: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    content: Attribute.RichText &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::age-group.age-group',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    ingress: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    links: Attribute.Component<'links.link', true> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::age-group.age-group',
      'oneToMany',
      'api::age-group.age-group'
    >;
    logo: Attribute.Media<'images'>;
    lower_content_area: Attribute.DynamicZone<
      [
        'blocks.hero-block',
        'blocks.image-block',
        'blocks.text-block',
        'blocks.video-block'
      ]
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    main_image: Attribute.Media<'images'>;
    maximum_age: Attribute.Integer &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Attribute.SetMinMax<
        {
          max: 100;
          min: 1;
        },
        number
      >;
    minimum_age: Attribute.Integer &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Attribute.SetMinMax<
        {
          max: 100;
          min: 1;
        },
        number
      >;
    publishedAt: Attribute.DateTime;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::age-group.age-group',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    upper_content_area: Attribute.DynamicZone<
      [
        'blocks.hero-block',
        'blocks.image-block',
        'blocks.text-block',
        'blocks.video-block'
      ]
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    wp_guid: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
  };
}

export interface ApiBlockWidthBlockWidth extends Schema.CollectionType {
  collectionName: 'block_widths';
  info: {
    displayName: 'Block-width';
    name: 'block-width';
    pluralName: 'block-widths';
    singularName: 'block-width';
  };
  options: {
    draftAndPublish: false;
    increments: true;
    timestamps: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::block-width.block-width',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::block-width.block-width',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCommentComment extends Schema.CollectionType {
  collectionName: 'comments';
  info: {
    displayName: 'Comment';
    name: 'comment';
    pluralName: 'comments';
    singularName: 'comment';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  attributes: {
    author: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::comment.comment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    publishedAt: Attribute.DateTime;
    scout_group: Attribute.String;
    suggestion: Attribute.Relation<
      'api::comment.comment',
      'manyToOne',
      'api::suggestion.suggestion'
    >;
    text: Attribute.Text & Attribute.Required;
    title: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::comment.comment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContentPageContentPage extends Schema.CollectionType {
  collectionName: 'content_pages';
  info: {
    displayName: 'Content-page';
    name: 'content-page';
    pluralName: 'content-pages';
    singularName: 'content-page';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    content: Attribute.DynamicZone<
      [
        'blocks.text-block',
        'blocks.hero-block',
        'blocks.image-block',
        'blocks.link-block',
        'blocks.activity-block',
        'blocks.age-group-block',
        'blocks.content-page-block',
        'blocks.video-block'
      ]
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::content-page.content-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    ingress: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::content-page.content-page',
      'oneToMany',
      'api::content-page.content-page'
    >;
    main_image: Attribute.Media<'images'>;
    main_text: Attribute.RichText &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    meta_description: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    meta_title: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Attribute.DateTime;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::content-page.content-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCookiePageCookiePage extends Schema.SingleType {
  collectionName: 'cookie_pages';
  info: {
    displayName: 'Cookie-page';
    name: 'cookie-page';
    pluralName: 'cookie-pages';
    singularName: 'cookie-page';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::cookie-page.cookie-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    ingress: Attribute.Text &
      Attribute.Unique &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::cookie-page.cookie-page',
      'oneToMany',
      'api::cookie-page.cookie-page'
    >;
    publishedAt: Attribute.DateTime;
    title: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::cookie-page.cookie-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDurationDuration extends Schema.CollectionType {
  collectionName: 'durations';
  info: {
    displayName: 'Duration';
    name: 'duration';
    pluralName: 'durations';
    singularName: 'duration';
  };
  options: {
    draftAndPublish: false;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    activities: Attribute.Relation<
      'api::duration.duration',
      'oneToMany',
      'api::activity.activity'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::duration.duration',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::duration.duration',
      'oneToMany',
      'api::duration.duration'
    >;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    preparation_activities: Attribute.Relation<
      'api::duration.duration',
      'oneToMany',
      'api::activity.activity'
    >;
    slug: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::duration.duration',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEducationalObjectiveEducationalObjective
  extends Schema.CollectionType {
  collectionName: 'educational_objectives';
  info: {
    displayName: 'Educational-objective';
    name: 'educational-objective';
    pluralName: 'educational-objectives';
    singularName: 'educational-objective';
  };
  options: {
    comment: '';
    draftAndPublish: false;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    activities: Attribute.Relation<
      'api::educational-objective.educational-objective',
      'manyToMany',
      'api::activity.activity'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::educational-objective.educational-objective',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::educational-objective.educational-objective',
      'oneToMany',
      'api::educational-objective.educational-objective'
    >;
    name: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    slug: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::educational-objective.educational-objective',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEquipmentEquipment extends Schema.CollectionType {
  collectionName: 'equipments';
  info: {
    displayName: 'Equipment';
    name: 'equipment';
    pluralName: 'equipments';
    singularName: 'equipment';
  };
  options: {
    comment: '';
    draftAndPublish: false;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::equipment.equipment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::equipment.equipment',
      'oneToMany',
      'api::equipment.equipment'
    >;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    slug: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::equipment.equipment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFrontPageFrontPage extends Schema.CollectionType {
  collectionName: 'front_pages';
  info: {
    displayName: 'Front-page';
    name: 'front-page';
    pluralName: 'front-pages';
    singularName: 'front-page';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    content: Attribute.DynamicZone<
      [
        'blocks.content-page-block',
        'blocks.age-group-block',
        'blocks.hero-block',
        'blocks.link-block',
        'blocks.video-block',
        'blocks.image-block',
        'blocks.text-block',
        'blocks.activity-block'
      ]
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::front-page.front-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    footer_sections: Attribute.Component<'footer.footer-section', true> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    hero_image: Attribute.Media<'images'>;
    hero_link_text: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    hero_link_url: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    ingress: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::front-page.front-page',
      'oneToMany',
      'api::front-page.front-page'
    >;
    meta_description: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    meta_title: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    navigation: Attribute.Component<'navigation.navigation', true> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Attribute.DateTime;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::front-page.front-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGroupSizeGroupSize extends Schema.CollectionType {
  collectionName: 'group_sizes';
  info: {
    displayName: 'Group-size';
    name: 'group-size';
    pluralName: 'group-sizes';
    singularName: 'group-size';
  };
  options: {
    comment: '';
    draftAndPublish: false;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::group-size.group-size',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    icon: Attribute.Media<'images'>;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::group-size.group-size',
      'oneToMany',
      'api::group-size.group-size'
    >;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    slug: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::group-size.group-size',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLeaderSkillLeaderSkill extends Schema.CollectionType {
  collectionName: 'leader_skills';
  info: {
    displayName: 'Leader-skill';
    name: 'leader-skill';
    pluralName: 'leader-skills';
    singularName: 'leader-skill';
  };
  options: {
    comment: '';
    draftAndPublish: false;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    activities: Attribute.Relation<
      'api::leader-skill.leader-skill',
      'manyToMany',
      'api::activity.activity'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::leader-skill.leader-skill',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::leader-skill.leader-skill',
      'oneToMany',
      'api::leader-skill.leader-skill'
    >;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    slug: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::leader-skill.leader-skill',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLocationLocation extends Schema.CollectionType {
  collectionName: 'locations';
  info: {
    displayName: 'Location';
    name: 'location';
    pluralName: 'locations';
    singularName: 'location';
  };
  options: {
    comment: '';
    draftAndPublish: false;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    activities: Attribute.Relation<
      'api::location.location',
      'manyToMany',
      'api::activity.activity'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::location.location',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    icon: Attribute.Media<'images'>;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::location.location',
      'oneToMany',
      'api::location.location'
    >;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    slug: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::location.location',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNotFoundPageNotFoundPage extends Schema.SingleType {
  collectionName: 'not_found_pages';
  info: {
    displayName: 'Not-found-page';
    name: 'not-found-page';
    pluralName: 'not-found-pages';
    singularName: 'not-found-page';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    content: Attribute.DynamicZone<
      [
        'blocks.hero-block',
        'blocks.link-block',
        'blocks.age-group-block',
        'blocks.content-page-block',
        'blocks.video-block',
        'blocks.image-block',
        'blocks.text-block',
        'blocks.activity-block'
      ]
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::not-found-page.not-found-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    ingress: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::not-found-page.not-found-page',
      'oneToMany',
      'api::not-found-page.not-found-page'
    >;
    publishedAt: Attribute.DateTime;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::not-found-page.not-found-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSettingSetting extends Schema.SingleType {
  collectionName: 'settings';
  info: {
    displayName: 'Setting';
    name: 'setting';
    pluralName: 'settings';
    singularName: 'setting';
  };
  options: {
    draftAndPublish: false;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::setting.setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::setting.setting',
      'oneToMany',
      'api::setting.setting'
    >;
    suggestion_notification_recipients: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    translations: Attribute.JSON &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::setting.setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSkillAreaSkillArea extends Schema.CollectionType {
  collectionName: 'skill_areas';
  info: {
    displayName: 'Skill-area';
    name: 'skill-area';
    pluralName: 'skill-areas';
    singularName: 'skill-area';
  };
  options: {
    comment: '';
    draftAndPublish: false;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    activities: Attribute.Relation<
      'api::skill-area.skill-area',
      'manyToMany',
      'api::activity.activity'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::skill-area.skill-area',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::skill-area.skill-area',
      'oneToMany',
      'api::skill-area.skill-area'
    >;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    slug: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::skill-area.skill-area',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSuggestionSuggestion extends Schema.CollectionType {
  collectionName: 'suggestions';
  info: {
    displayName: 'Suggestion';
    name: 'suggestion';
    pluralName: 'suggestions';
    singularName: 'suggestion';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    activity: Attribute.Relation<
      'api::suggestion.suggestion',
      'manyToOne',
      'api::activity.activity'
    >;
    author: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    comments: Attribute.Relation<
      'api::suggestion.suggestion',
      'oneToMany',
      'api::comment.comment'
    >;
    content: Attribute.Text &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::suggestion.suggestion',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    duration: Attribute.Relation<
      'api::suggestion.suggestion',
      'oneToOne',
      'api::duration.duration'
    >;
    files: Attribute.Media<'files' | 'images' | 'videos', true>;
    from_web: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Attribute.DefaultTo<false>;
    like_count: Attribute.Integer &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Attribute.DefaultTo<0>;
    likes: Attribute.JSON &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Attribute.DefaultTo<[]>;
    links: Attribute.Component<'links.link', true> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::suggestion.suggestion',
      'oneToMany',
      'api::suggestion.suggestion'
    >;
    locations: Attribute.Relation<
      'api::suggestion.suggestion',
      'oneToMany',
      'api::location.location'
    >;
    pinned: Attribute.Boolean & Attribute.DefaultTo<false>;
    publishedAt: Attribute.DateTime;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::suggestion.suggestion',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    wp_guid: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    timezone: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    isEntryValid: Attribute.Boolean;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDeploySiteContentChange extends Schema.CollectionType {
  collectionName: 'content_changes';
  info: {
    description: 'Content changes';
    displayName: 'Content-change';
    pluralName: 'content-changes';
    singularName: 'content-change';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    'content-manager': {
      visible: true;
    };
    'content-type-builder': {
      visible: true;
    };
  };
  attributes: {
    change_time: Attribute.DateTime;
    change_type: Attribute.String & Attribute.Required;
    content_id: Attribute.Integer & Attribute.Required;
    content_name: Attribute.String & Attribute.Required;
    content_type: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::deploy-site.content-change',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    deployed_at: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::deploy-site.content-change',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDeploySiteDeploySiteSetting extends Schema.SingleType {
  collectionName: 'deploy_site_settings';
  info: {
    description: 'Deploy site settings';
    displayName: 'deploy-site-setting';
    pluralName: 'deploy-site-settings';
    singularName: 'deploy-site-setting';
  };
  options: {
    comment: '';
    draftAndPublish: false;
    increments: true;
    timestamps: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::deploy-site.deploy-site-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    deploy_webhook_url: Attribute.String;
    preview_updates: Attribute.Boolean & Attribute.DefaultTo<true>;
    preview_url: Attribute.String;
    preview_webhook_url: Attribute.String;
    track_content_changes: Attribute.Boolean & Attribute.DefaultTo<true>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::deploy-site.deploy-site-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginNavigationAudience extends Schema.CollectionType {
  collectionName: 'audience';
  info: {
    displayName: 'Audience';
    name: 'audience';
    pluralName: 'audiences';
    singularName: 'audience';
  };
  options: {
    comment: 'Audience';
    increments: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::navigation.audience',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    key: Attribute.UID<'plugin::navigation.audience', 'name'>;
    name: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::navigation.audience',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginNavigationNavigation extends Schema.CollectionType {
  collectionName: 'navigations';
  info: {
    displayName: 'Navigation';
    name: 'navigation';
    pluralName: 'navigations';
    singularName: 'navigation';
  };
  options: {
    comment: '';
    increments: true;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::navigation.navigation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    items: Attribute.Relation<
      'plugin::navigation.navigation',
      'oneToMany',
      'plugin::navigation.navigation-item'
    >;
    localeCode: Attribute.String;
    localizations: Attribute.Relation<
      'plugin::navigation.navigation',
      'oneToMany',
      'plugin::navigation.navigation'
    >;
    name: Attribute.Text & Attribute.Required;
    slug: Attribute.UID & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::navigation.navigation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    visible: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface PluginNavigationNavigationItem extends Schema.CollectionType {
  collectionName: 'navigations_items';
  info: {
    displayName: 'Navigation Item';
    name: 'navigation-item';
    pluralName: 'navigation-items';
    singularName: 'navigation-item';
  };
  options: {
    comment: 'Navigation Item';
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
    i18n: {
      localized: false;
    };
  };
  attributes: {
    additionalFields: Attribute.JSON & Attribute.DefaultTo<{}>;
    audience: Attribute.Relation<
      'plugin::navigation.navigation-item',
      'oneToMany',
      'plugin::navigation.audience'
    >;
    autoSync: Attribute.Boolean & Attribute.DefaultTo<true>;
    collapsed: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::navigation.navigation-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    externalPath: Attribute.Text;
    master: Attribute.Relation<
      'plugin::navigation.navigation-item',
      'manyToOne',
      'plugin::navigation.navigation'
    >;
    menuAttached: Attribute.Boolean & Attribute.DefaultTo<false>;
    order: Attribute.Integer & Attribute.DefaultTo<0>;
    parent: Attribute.Relation<
      'plugin::navigation.navigation-item',
      'oneToOne',
      'plugin::navigation.navigation-item'
    >;
    path: Attribute.Text;
    related: Attribute.Relation<
      'plugin::navigation.navigation-item',
      'oneToOne',
      'plugin::navigation.navigations-items-related'
    >;
    title: Attribute.Text &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    type: Attribute.Enumeration<['INTERNAL', 'EXTERNAL', 'WRAPPER']> &
      Attribute.DefaultTo<'INTERNAL'>;
    uiRouterKey: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::navigation.navigation-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginNavigationNavigationsItemsRelated
  extends Schema.CollectionType {
  collectionName: 'navigations_items_related';
  info: {
    displayName: 'Navigations Items Related';
    name: 'navigations_items_related';
    pluralName: 'navigations-items-relateds';
    singularName: 'navigations-items-related';
  };
  options: {
    increments: true;
    populateCreatorFields: false;
    timestamps: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
    i18n: {
      localized: false;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::navigation.navigations-items-related',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    field: Attribute.String & Attribute.Required;
    master: Attribute.String & Attribute.Required;
    order: Attribute.Integer & Attribute.Required;
    related_id: Attribute.String & Attribute.Required;
    related_type: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::navigation.navigations-items-related',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Attribute.String;
    caption: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    ext: Attribute.String;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    height: Attribute.Integer;
    mime: Attribute.String & Attribute.Required;
    name: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    size: Attribute.Decimal & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    url: Attribute.String & Attribute.Required;
    width: Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    type: Attribute.String & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    resetPasswordToken: Attribute.String & Attribute.Private;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::activity-group-category.activity-group-category': ApiActivityGroupCategoryActivityGroupCategory;
      'api::activity-group.activity-group': ApiActivityGroupActivityGroup;
      'api::activity-level.activity-level': ApiActivityLevelActivityLevel;
      'api::activity-term.activity-term': ApiActivityTermActivityTerm;
      'api::activity.activity': ApiActivityActivity;
      'api::activitygroup-term.activitygroup-term': ApiActivitygroupTermActivitygroupTerm;
      'api::age-group.age-group': ApiAgeGroupAgeGroup;
      'api::block-width.block-width': ApiBlockWidthBlockWidth;
      'api::comment.comment': ApiCommentComment;
      'api::content-page.content-page': ApiContentPageContentPage;
      'api::cookie-page.cookie-page': ApiCookiePageCookiePage;
      'api::duration.duration': ApiDurationDuration;
      'api::educational-objective.educational-objective': ApiEducationalObjectiveEducationalObjective;
      'api::equipment.equipment': ApiEquipmentEquipment;
      'api::front-page.front-page': ApiFrontPageFrontPage;
      'api::group-size.group-size': ApiGroupSizeGroupSize;
      'api::leader-skill.leader-skill': ApiLeaderSkillLeaderSkill;
      'api::location.location': ApiLocationLocation;
      'api::not-found-page.not-found-page': ApiNotFoundPageNotFoundPage;
      'api::setting.setting': ApiSettingSetting;
      'api::skill-area.skill-area': ApiSkillAreaSkillArea;
      'api::suggestion.suggestion': ApiSuggestionSuggestion;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::deploy-site.content-change': PluginDeploySiteContentChange;
      'plugin::deploy-site.deploy-site-setting': PluginDeploySiteDeploySiteSetting;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::navigation.audience': PluginNavigationAudience;
      'plugin::navigation.navigation': PluginNavigationNavigation;
      'plugin::navigation.navigation-item': PluginNavigationNavigationItem;
      'plugin::navigation.navigations-items-related': PluginNavigationNavigationsItemsRelated;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
