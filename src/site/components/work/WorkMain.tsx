import React from 'react'

/** The work page: every project in the stacked full-screen grid */
export function WorkMain({
  workFilters,
  workItems,
}: {
  workFilters: React.ReactNode
  workItems: React.ReactNode
}) {
  return (
    <div className="container-wrap">
      <div className="container main-content" role="main">
        <div className="row">
          <div
            id="fws_6adfb903af89b"
            data-column-margin="default"
            data-midnight="dark"
            className="wpb_row vc_row-fluid vc_row top-level full-width-content vc_row-o-equal-height vc_row-flex vc_row-o-content-top  right_padding_60px left_padding_60px top_padding_tablet_70px right_padding_tablet_25px left_padding_tablet_25px"
            style={{ paddingTop: '105px', paddingBottom: '0px' }}
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
                className="vc_col-sm-12 wpb_column column_container vc_column_container col no-extra-padding inherit_tablet inherit_phone flex_gap_desktop_10px "
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
                      className="nectar-post-grid-wrap text-color-light additional-meta-size-small spacing-25px"
                      data-el-settings={
                        '{"post_type":"portfolio","pagination":"none","image_size":"full","parallax_scrolling":"","aspect_ratio_image_size":"","category_position":"default","category_display":"parent_only","display_categories":"yes","display_excerpt":"0","excerpt_length":"20","content_next_to_image_excerpt_pos":"default","display_date":"yes","display_estimated_reading_time":"0","display_author":"0","author_functionality":"default","author_position":"default","color_overlay":"#141414","color_overlay_opacity":"0.2","color_overlay_hover_opacity":"0.2","card_bg_color":"","grid_style":"content_overlaid","hover_effect":"none","post_title_overlay":"","heading_tag":"h1","heading_tag_render":"default","enable_gallery_lightbox":"0","remove_links":"0","category_style":"see-through-button","overlay_secondary_project_image":"","vertical_list_hover_effect":"none","vertical_list_read_more":"","vertical_list_read_more_style":"text","read_more_button":"0","animation":"none","custom_fields":"%5B%5D","custom_fields_location":"before_post_meta","display_type":"stack","text_content_layout":"all_middle"}'
                      }
                      data-style="content_overlaid"
                      data-query={
                        '{"post_type":"portfolio","posts_per_page":"5","order":"DESC","orderby":"date","offset":"0","cpt_name":"post","custom_query_tax":"","ignore_sticky_posts":"","exclude_current_post":""}'
                      }
                      data-load-more-color="black"
                      data-load-more-text="Load More"
                    >
                      <div
                        className="nectar-post-grid-filters"
                        data-active-color="default"
                        data-align="default"
                        data-animation="none"
                        data-sortable=""
                      >
                        <div>{workFilters}</div>
                      </div>
                      <div
                        className="nectar-post-grid layout-stacked subtract-nav-height custom_font_size_9vw font_size_max_220px font_size_tablet_10vw font_size_phone_12vw font_line_height_1-1 text-opacity-1 text-opacity-hover-1 category-position-before-title "
                        data-lazy-skip="2"
                        data-indicator="yes"
                        data-indicator-style="tooltip_text"
                        data-indicator-blur="true"
                        data-indicator-text-color="#ffffff"
                        data-indicator-color="rgba(0,0,0,0.23)"
                        data-indicator-text="View"
                        data-stack-animation-effect="blurred_scale"
                        data-post-item-bg-color="#141414"
                        data-columns="1"
                        data-hover-effect="none"
                        data-text-style="default"
                        data-border-radius="15px"
                        data-grid-item-height="90vh"
                        data-grid-spacing="25px"
                        data-text-layout="all_middle"
                        data-text-color="light"
                        data-text-hover-color="light"
                        data-shadow-hover=""
                        data-animation="none"
                        data-animation-stagger="90"
                        data-cat-click="static"
                        style={{ '--post-grid-border-radius': '15px' } as React.CSSProperties}
                      >
                        {workItems}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
