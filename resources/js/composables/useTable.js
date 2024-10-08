import { cloneDeep, debounce, difference } from 'lodash'
import { watch } from 'vue'

export default function useTable(defaultData, fetchFn, storageInstance) {

    const { activeData, set: saveToStorage } = storageInstance

    const getColumn = field => {
        return activeData.value.columns.find(col => col.field === field) || null
    }

    const getSearchGlobalValue = () => {
        return activeData.value.filters?.global?.constraints[0]?.value || null
    }

    const getSearchValues = field => {
        return activeData.value.filters?.[field]?.constraints?.map(value => value.value) || []
    }

    const getSortedFields = () => {
        return activeData.value.sort.map(item => item.field)
    }

    const getVisibleFields = () => {
        return activeData.value.columns.filter(item => item.visible).map(item => item.field)
    }

    const isVisible = field => getVisibleFields().includes(field)

    watch(activeData, () => {
        saveToStorage()
    }, { deep: true })

    const getModeFromMap = fieldType => {
        const modeMapping = {
            number: 'equals',
            date: 'date_equals',
            boolean: 'equals',
            string: 'contains',
        }

        return modeMapping[fieldType] || 'contains'
    }

    const setConstraints = (col, value) => {
        const modeMapping = {
            number: 'equals',
            date: 'date_equals',
            boolean: 'equals',
            string: 'equals',
        }

        const mode = modeMapping[col.type] || 'equals'

        activeData.value.filters[col.field].constraints = [{ value, mode }]
        filter()
    }

    const getFilteredFields = () => {
        const { filters } = activeData.value

        return Object.keys(filters).filter(key => {
            return filters[key].constraints.some(({ value }) => value !== null && value !== '')
        })
    }

    const clearFilters = () => {
        const { filters } = activeData.value

        Object.keys(filters).forEach(key => {
            filters[key].constraints = [{ value: null, mode: filters[key].constraints[0].mode }]
        })

        filter()
    }

    const clearFilter = (field) => {
        activeData.value.filters[field].constraints = [{
            value: null,
            mode: activeData.value.filters[field].constraints[0].mode
        }]
    }

    const clearSort = (field) => {
        activeData.value.sort = activeData.value.sort.filter(item => item.field !== field)
    }

    const getModifiedFields = (filters, filtered) => {
        filters = getFilteredFields()
        return difference(filters, filtered)
    }

    const reset = () => {
        activeData.value.filters = cloneDeep(defaultData.filters)

        const filteredFields = getFilteredFields()

        activeData.value.columns.forEach(column => {
            column.visible = column.visible ? true : filteredFields.includes(column.field)
        })

        filter()
    }

    const fetch = debounce(fetchFn, 300, { leading: true, trailing: true })

    const filter = (doFetch = true, setPageFirst = true) => {
        if (setPageFirst) {
            activeData.value.pagination.page = 1
        }

        activeData.value.filtered = getFilteredFields(activeData.value.filters)

        if (doFetch) {
            fetch()
        }
    }

    filter(true, false)

    return {
        getColumn,
        getModeFromMap,
        getFilteredFields,
        getModifiedFields,
        getSortedFields,
        setConstraints,
        getSearchGlobalValue,
        getSearchValues,
        isVisible,
        getVisibleFields,
        reset,
        fetch,
        filter,
        clearFilters,
        clearFilter,
        clearSort,
    }
}
