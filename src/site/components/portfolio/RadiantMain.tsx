import React from 'react'

/** The radiant case study layout: title row, image rows and Other Work */
export function RadiantMain({
  title,
  tagline,
  body,
  expertises,
  services,
  galleryRows,
  otherWorkHeading,
  otherFilters,
  otherItems,
}: {
  title: string
  tagline: string
  body: string
  expertises: React.ReactNode
  services: React.ReactNode
  galleryRows: React.ReactNode
  otherWorkHeading: string
  otherFilters: React.ReactNode
  otherItems: React.ReactNode
}) {
  return (
    <div
      id="full_width_portfolio"
      data-featured-img="/signal/wp/uploads/sites/45/2025/06/christian-agbede-aohV_aatqQw-unsplash-1-1.jpg"
    >
      <div className="container-wrap" data-nav-pos="none" data-rm-header="true">
        <div className="container main-content" role="main">
          <div className="row  ">
            <div className="post-area col span_12">
              <div id="portfolio-extra">
                <div
                  id="fws_6adfea730080d"
                  data-column-margin="custom"
                  data-midnight="dark"
                  data-top-percent="11%"
                  data-bottom-percent="7%"
                  className="wpb_row vc_row-fluid vc_row full-width-content vc_row-o-equal-height vc_row-flex vc_row-o-content-top  right_padding_60px left_padding_60px column-margin-17vw top_padding_phone_5rem bottom_padding_phone_3rem right_padding_tablet_25px left_padding_tablet_25px"
                  style={{ paddingTop: 'calc(100vw * 0.11)', paddingBottom: 'calc(100vw * 0.07)' }}
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
                      className="vc_col-sm-3/5 wpb_column column_container vc_column_container col no-extra-padding inherit_tablet inherit_phone flex_gap_desktop_10px "
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
                            <h1>{title}</h1>
                          </div>
                          <div
                            className="nectar-responsive-text nectar-link-underline-effect"
                            data-inherit-heading-family="h1"
                          >
                            <h2>{tagline}</h2>
                          </div>
                          <div className="nectar-responsive-text nectar-link-underline-effect">
                            <p>{body}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="vc_col-sm-2/5 wpb_column column_container vc_column_container col no-extra-padding el_spacing_10px top_margin_tablet_40px inherit_tablet inherit_phone "
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
                            <p>Expertises</p>
                          </div>
                          <span
                            className="nectar-meta-category-el  direction-vertical style-default nectar-inherit-h4"
                            style={{ '--term-gap': '2px' } as React.CSSProperties}
                          >
                            {expertises}
                          </span>
                          <div
                            className="divider-wrap height_tablet_20px "
                            data-alignment="default"
                          >
                            <div style={{ height: '40px' }} className="divider" />
                          </div>
                          <div
                            className="nectar-responsive-text nectar-link-underline-effect"
                            data-inherit-heading-family="h6"
                          >
                            <p>Services</p>
                          </div>
                          <span
                            className="nectar-meta-category-el  direction-vertical style-default nectar-inherit-h4"
                            style={{ '--term-gap': '2px' } as React.CSSProperties}
                          >
                            {services}
                          </span>{' '}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <section
                  id="fws_6adfea7301634"
                  data-column-margin="default"
                  data-midnight="dark"
                  className="nectar_section wpb_row vc_row  flex_layout_desktop_column flex_justify_content_desktop_flex-start flex_align_items_desktop_flex-start flex_wrap_desktop_nowrap flex_reverse_desktop_false flex_gap_desktop_20px"
                  style={{ paddingTop: '0px', paddingBottom: '0px' }}
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
                  <div className="row_col_wrap_12 span_12 dark ">{galleryRows}</div>
                </section>
              </div>
            </div>
          </div>
          <div className="nectar-global-section salient_portfolio_hook_single_after_content">
            <div className="container normal-container row">
              <div
                id="fws_6adfea73041a4"
                data-column-margin="default"
                data-midnight="dark"
                data-top-percent="6%"
                className="wpb_row vc_row-fluid vc_row full-width-content vc_row-o-equal-height vc_row-flex vc_row-o-content-top  right_padding_60px left_padding_60px top_padding_tablet_15pct right_padding_tablet_25px left_padding_tablet_25px"
                style={{ paddingTop: 'calc(100vw * 0.06)', paddingBottom: '0px' }}
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
                          id="fws_6adfea7309d4d"
                          data-midnight=""
                          data-column-margin="default"
                          className="wpb_row vc_row-fluid vc_row inner_row"
                        >
                          <div className="row-bg-wrap">
                            <div className="row-bg" />
                          </div>
                          <div className="row_col_wrap_12_inner col span_12  left">
                            <div
                              className="vc_col-sm-6 vc_col-xs-6 wpb_column column_container vc_column_container col child_column no-extra-padding inherit_tablet inherit_phone "
                              data-t-w-inherits="small_desktop"
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
                                    <p>{otherWorkHeading}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              className="vc_col-sm-6 vc_col-xs-6 wpb_column column_container vc_column_container col child_column no-extra-padding inherit_tablet inherit_phone "
                              data-t-w-inherits="small_desktop"
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
                                    className="nectar-cta  alignment_tablet_default alignment_phone_default display_tablet_inherit display_phone_inherit "
                                    data-color="default"
                                    data-using-bg="false"
                                    data-style="text-reveal"
                                    data-display="block"
                                    data-alignment="right"
                                    data-text-color="std"
                                    style={
                                      {
                                        '--nectar-button-color': 'var(--nectar-default)',
                                        '--nectar-icon-gap': '10px',
                                      } as React.CSSProperties
                                    }
                                  >
                                    <h6>
                                      <span className="link_wrap">
                                        <a className="link_text" role="button" href="/work">
                                          <span
                                            className="text nectar-text-reveal-button__text"
                                            data-text="View All"
                                          >
                                            View All
                                          </span>
                                        </a>
                                      </span>
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="nectar-post-grid-wrap text-color-dark spacing-15px"
                          data-el-settings={
                            '{"post_type":"portfolio","pagination":"none","image_size":"portfolio-thumb_large","parallax_scrolling":"","aspect_ratio_image_size":"","category_position":"default","category_display":"default","display_categories":"0","display_excerpt":"0","excerpt_length":"20","content_next_to_image_excerpt_pos":"default","display_date":"0","display_estimated_reading_time":"0","display_author":"0","author_functionality":"default","author_position":"default","color_overlay":"","color_overlay_opacity":"","color_overlay_hover_opacity":"","card_bg_color":"","grid_style":"vertical_list","hover_effect":"","post_title_overlay":"","heading_tag":"h3","heading_tag_render":"default","enable_gallery_lightbox":"0","remove_links":"0","category_style":"underline","overlay_secondary_project_image":"","vertical_list_hover_effect":"featured_image_follow","vertical_list_read_more":"yes","vertical_list_read_more_style":"arrow","read_more_button":"0","animation":"fade-in-from-bottom","custom_fields":"","custom_fields_location":"before_post_meta","display_type":"grid","text_content_layout":"top_left"}'
                          }
                          data-style="vertical_list"
                          data-query={
                            '{"post_type":"portfolio","posts_per_page":"3","order":"DESC","orderby":"rand","offset":"0","cpt_name":"post","custom_query_tax":"","ignore_sticky_posts":"yes","exclude_current_post":"yes"}'
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
                            <div>{otherFilters}</div>
                          </div>
                          <div
                            className="nectar-post-grid custom_font_size_3vw category-position-before-title vert_list_bg_hover_121213 vert_list_text_hover_F1EFED vert_list_hover_effect_featured_image_follow "
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
                            {otherItems}
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
      </div>
    </div>
  )
}
