import React from 'react'

/** Featured Work: the filterable project list */
export function FeaturedWorkSection({
  workHeading,
  workFilters,
  workItems,
}: {
  workHeading: string
  workFilters: React.ReactNode
  workItems: React.ReactNode
}) {
  return (
    <div
      id="fws_6adfaabe964d7"
      data-column-margin="default"
      data-midnight="dark"
      data-top-percent="6%"
      data-bottom-percent="5%"
      className="wpb_row vc_row-fluid vc_row full-width-content vc_row-o-equal-height vc_row-flex vc_row-o-content-top  right_padding_60px left_padding_60px top_padding_tablet_15pct right_padding_tablet_25px left_padding_tablet_25px"
      style={{ paddingTop: 'calc(100vw * 0.06)', paddingBottom: 'calc(100vw * 0.05)' }}
    >
      <div
        className="row-bg-wrap"
        data-bg-animation="none"
        data-bg-animation-delay=""
        data-bg-overlay="false"
      >
        <div className="inner-wrap row-bg-layer">
          <div className="row-bg viewport-desktop" />
        </div>
      </div>
      <div className="row_col_wrap_12 col span_12 dark left">
        <div
          className="vc_col-sm-12 wpb_column column_container vc_column_container col no-extra-padding el_spacing_20px inherit_tablet inherit_phone "
          data-padding-pos="all"
          data-has-bg-color="false"
          data-bg-color=""
          data-bg-opacity="1"
          data-animation=""
          data-delay="0"
        >
          <div className="vc_column-inner">
            <div className="wpb_wrapper">
              <div
                className="nectar-responsive-text nectar-link-underline-effect"
                data-inherit-heading-family="h6"
              >
                <p>{workHeading}</p>
              </div>
              <div
                className="nectar-post-grid-wrap text-color-dark spacing-15px"
                data-el-settings={
                  '{"post_type":"portfolio","pagination":"none","image_size":"portfolio-thumb_large","parallax_scrolling":"","aspect_ratio_image_size":"","category_position":"default","category_display":"default","display_categories":"0","display_excerpt":"0","excerpt_length":"20","content_next_to_image_excerpt_pos":"default","display_date":"0","display_estimated_reading_time":"0","display_author":"0","author_functionality":"default","author_position":"default","color_overlay":"","color_overlay_opacity":"","color_overlay_hover_opacity":"","card_bg_color":"","grid_style":"vertical_list","hover_effect":"","post_title_overlay":"","heading_tag":"h2","heading_tag_render":"default","enable_gallery_lightbox":"0","remove_links":"0","category_style":"underline","overlay_secondary_project_image":"","vertical_list_hover_effect":"featured_image_follow","vertical_list_read_more":"yes","vertical_list_read_more_style":"arrow","read_more_button":"0","animation":"fade-in-from-bottom","custom_fields":"","custom_fields_location":"before_post_meta","display_type":"grid","text_content_layout":"top_left"}'
                }
                data-style="vertical_list"
                data-query={
                  '{"post_type":"portfolio","posts_per_page":"6","order":"DESC","orderby":"date","offset":"0","cpt_name":"post","custom_query_tax":"","ignore_sticky_posts":"yes","exclude_current_post":""}'
                }
                data-load-more-color="black"
                data-load-more-text="Load More"
              >
                <div
                  className="nectar-post-grid-filters"
                  data-active-color="default"
                  data-align="default"
                  data-animation="fade-in-from-bottom"
                  data-sortable=""
                >
                  <div>{workFilters}</div>
                </div>
                <div
                  className="nectar-post-grid category-position-before-title vert_list_bg_hover_121213 vert_list_text_hover_F0EAE6 vert_list_hover_effect_featured_image_follow "
                  data-indicator=""
                  data-indicator-style="default"
                  data-indicator-text-color="#fff"
                  data-indicator-color="#000"
                  data-indicator-text="View"
                  data-columns="1"
                  data-hover-effect=""
                  data-text-style="default"
                  data-border-radius="10px"
                  data-grid-item-height="30vh"
                  data-grid-spacing="15px"
                  data-text-layout="top_left"
                  data-text-color="dark"
                  data-text-hover-color="dark"
                  data-shadow-hover=""
                  data-animation="fade-in-from-bottom"
                  data-animation-stagger="150"
                  data-cat-click="default"
                  style={{ '--post-grid-border-radius': '10px' } as React.CSSProperties}
                >
                  {workItems}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
