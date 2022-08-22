import Helper from '@ember/component/helper';
import classic from 'ember-classic-decorator';
import {isBlank} from '@ember/utils';
import {inject as service} from '@ember/service';

@classic
export default class AuditLogEventFilter extends Helper {
    @service settings;
    @service feature;

    compute(
        positionalParams,
        {excludedEvents = [], excludedResources = [], user = ''}
    ) {
        const excludedEventsSet = new Set();
        const excludedResourcesSet = new Set();

        if (excludedEvents.length) {
            excludedEvents.forEach(type => excludedEventsSet.add(type));
        }

        if (excludedResources.length) {
            excludedResources.forEach(type => excludedResourcesSet.add(type));
        }

        let filterParts = [];

        const excludedEventsArray = Array.from(excludedEventsSet).reject(isBlank);
        if (excludedEventsArray.length > 0) {
            filterParts.push(`event:-[${excludedEventsArray.join(',')}]`);
        }

        const excludedResourcesArray = Array.from(excludedResourcesSet).reject(isBlank);
        if (excludedResourcesArray.length > 0) {
            filterParts.push(`resource_type:-[${excludedResourcesArray.join(',')}]`);
        }

        if (user) {
            filterParts.push(`actor_id:${user}`);
        }

        return filterParts.join('+');
    }
}