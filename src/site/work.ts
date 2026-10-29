import { chromeValues, loadChrome, type SiteChrome } from './chrome'
import { markup, scripts, templates as T } from './generated/work'
import { loadWorkItems, originalCategories } from './projects'
import { fill, gridFilters, gridItems, type WorkItem } from './render'

/** The work page: every published project in the original stacked grid */
export const renderWork = (chrome: SiteChrome, work: WorkItem[]) => {
  const html = fill(markup, {
    ...chromeValues(chrome, T, '/work'),
    workFilters: gridFilters(T, work, originalCategories),
    workItems: gridItems(T.workItem, T.workCategory, work),
  })

  return { html, scripts }
}

export const workPage = async () => {
  const [chrome, work] = await Promise.all([loadChrome(), loadWorkItems()])
  return renderWork(chrome, work)
}
