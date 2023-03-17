import { flatMap, keyBy } from 'lodash';

export const COUNTRIES_TAG_GROUP = 'COUNTRIES';

export function filterTagsByTagGroup(tags, tagGroup) {
  if (tags.items) {
    const filteredTags = tags.items.filter(element => {
      return element.name.toUpperCase() === tagGroup;
    });

    if (filteredTags.length > 0) {
      return filteredTags[0].tags;
    }
  }

  return [];
}

export function getFlatTagsById(tags) {
  const flatTags = flatMap(tags, tagGroup => tagGroup.tags);

  return keyBy(flatTags, tag => tag.id);
}
