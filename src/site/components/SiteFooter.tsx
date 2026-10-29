import React from 'react'

/** The contact section (form, "Say Hello", "Get Social") and the SIGNAL wordmark */
export function SiteFooter({
  contactFormId,
  emailHref,
  email,
  socials,
  wordmark,
}: {
  contactFormId: string
  emailHref: string
  email: string
  socials: React.ReactNode
  wordmark: string
}) {
  return (
    <>
      <div className="nectar-global-section nectar_hook_global_section_footer" role="contentinfo">
        <div className="container normal-container row">
          <div
            id="contact"
            data-column-margin="custom"
            data-midnight="dark"
            data-top-percent="10%"
            data-bottom-percent="5%"
            data-color-change-section-bg-color="#FF9100"
            data-color-change-section-text-color="var(--nectar-font-color)"
            className="wpb_row vc_row-fluid vc_row full-width-content has-row-bg-color vc_row-o-equal-height vc_row-flex vc_row-o-content-top  right_padding_60px left_padding_60px column-margin-15vw top_padding_phone_5rem right_padding_tablet_25px left_padding_tablet_25px"
            style={
              {
                paddingTop: 'calc(100vw * 0.10)',
                paddingBottom: 'calc(100vw * 0.05)',
                '--row-bg-color': '#FF9100',
              } as React.CSSProperties
            }
          >
            <div
              className="row-bg-wrap"
              data-bg-animation="none"
              data-bg-animation-delay=""
              data-bg-overlay="false"
            >
              <div className="inner-wrap row-bg-layer">
                <div
                  className="row-bg viewport-desktop using-bg-color"
                  style={{ backgroundColor: '#FF9100' }}
                />
              </div>
            </div>
            <div className="row_col_wrap_12 col span_12 dark left">
              <div
                className="vc_col-sm-6 wpb_column column_container vc_column_container col no-extra-padding inherit_tablet inherit_phone flex_gap_desktop_10px "
                data-padding-pos="all"
                data-has-bg-color="false"
                data-bg-color=""
                data-bg-opacity="1"
                data-animation=""
                data-delay="0"
              >
                <div className="vc_column-inner">
                  <div className="wpb_wrapper">
                    <div className="wpb_text_column wpb_content_element ">
                      <div className="fluentform ff-inherit-theme-style fluentform_wrapper_3">
                        <form
                          data-signal-form={contactFormId}
                          data-form_id="3"
                          id="fluentform_3"
                          className="frm-fluent-form fluent_form_3 ff-el-form-top ff_form_instance_3_1 ff-form-loading ffs_inherit_theme"
                          data-form_instance="ff_form_instance_3_1"
                          method="POST"
                        >
                          <fieldset
                            style={{
                              border: 'none!important',
                              margin: '0!important',
                              padding: '0!important',
                              backgroundColor: 'transparent!important',
                              boxShadow: 'none!important',
                              outline: 'none!important',
                              minInlineSize: '100%',
                            }}
                          >
                            <legend
                              className="ff_screen_reader_title"
                              style={{
                                display: 'block',
                                margin: '0!important',
                                padding: '0!important',
                                height: '0!important',
                                textIndent: '-999999px',
                                width: '0!important',
                                overflow: 'hidden',
                              }}
                            >
                              Signal Contact Form
                            </legend>
                            <div
                              data-type="name-element"
                              data-name="names"
                              className=" ff-field_container ff-name-field-wrapper nectar-2col-mobile"
                            >
                              <div className="ff-t-container">
                                <div className="ff-t-cell ">
                                  <div className="ff-el-group  ff-el-form-hide_label">
                                    <div className="ff-el-input--label asterisk-right">
                                      <label
                                        htmlFor="ff_3_names_first_name_"
                                        id="label_ff_3_names_first_name_"
                                      >
                                        First Name
                                      </label>
                                    </div>
                                    <div className="ff-el-input--content">
                                      <input
                                        type="text"
                                        name="names[first_name]"
                                        id="ff_3_names_first_name_"
                                        className="ff-el-form-control"
                                        placeholder="First Name"
                                        aria-invalid="false"
                                        aria-required="false"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="ff-t-cell ">
                                  <div className="ff-el-group  ff-el-form-hide_label">
                                    <div className="ff-el-input--label asterisk-right">
                                      <label
                                        htmlFor="ff_3_names_last_name_"
                                        id="label_ff_3_names_last_name_"
                                      >
                                        Last Name
                                      </label>
                                    </div>
                                    <div className="ff-el-input--content">
                                      <input
                                        type="text"
                                        name="names[last_name]"
                                        id="ff_3_names_last_name_"
                                        className="ff-el-form-control"
                                        placeholder="Last Name"
                                        aria-invalid="false"
                                        aria-required="false"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              data-name="ff_cn_id_1"
                              className="ff-t-container ff-column-container ff_columns_total_2 nectar-2col-mobile"
                            >
                              <div className="ff-t-cell ff-t-column-1" style={{ flexBasis: '50%' }}>
                                <div className="ff-el-group ff-el-form-hide_label">
                                  <div className="ff-el-input--label ff-el-is-required asterisk-right">
                                    <label
                                      htmlFor="ff_3_email"
                                      id="label_ff_3_email"
                                      aria-label="Email"
                                    >
                                      Email
                                    </label>
                                  </div>
                                  <div className="ff-el-input--content">
                                    <input
                                      type="email"
                                      name="email"
                                      id="ff_3_email"
                                      className="ff-el-form-control"
                                      placeholder="Email Address"
                                      data-name="email"
                                      aria-invalid="false"
                                      aria-required="true"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="ff-t-cell ff-t-column-2" style={{ flexBasis: '50%' }}>
                                <div className="ff-el-group ff-el-form-hide_label">
                                  <div className="ff-el-input--label asterisk-right">
                                    <label
                                      htmlFor="ff_3_input_text"
                                      id="label_ff_3_input_text"
                                      aria-label="Text Input"
                                    >
                                      Text Input
                                    </label>
                                  </div>
                                  <div className="ff-el-input--content">
                                    <input
                                      type="text"
                                      name="input_text"
                                      className="ff-el-form-control"
                                      placeholder="Phone Number"
                                      data-name="input_text"
                                      id="ff_3_input_text"
                                      aria-invalid="false"
                                      aria-required="false"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="ff-el-group nectar-2col-mobile ff_list_2col">
                              <div className="ff-el-input--label asterisk-right">
                                <label aria-label="" />
                              </div>
                              <div className="ff-el-input--content">
                                <div className="ff-el-form-check ff-el-form-check-">
                                  <label
                                    className="ff-el-form-check-label"
                                    htmlFor="checkbox_4a526ab8264b169f60d57d4b9daa5ee5"
                                  >
                                    <input
                                      type="checkbox"
                                      name="checkbox[]"
                                      data-name="checkbox"
                                      className="ff-el-form-check-input ff-el-form-check-checkbox"
                                      defaultValue="Analytics"
                                      id="checkbox_4a526ab8264b169f60d57d4b9daa5ee5"
                                      aria-label="Analytics"
                                      aria-invalid="false"
                                      aria-required="false"
                                    />{' '}
                                    <span>Analytics</span>
                                  </label>
                                </div>
                                <div className="ff-el-form-check ff-el-form-check-">
                                  <label
                                    className="ff-el-form-check-label"
                                    htmlFor="checkbox_75eb5ba06cf654acf5af1f767f703f3a"
                                  >
                                    <input
                                      type="checkbox"
                                      name="checkbox[]"
                                      data-name="checkbox"
                                      className="ff-el-form-check-input ff-el-form-check-checkbox"
                                      defaultValue="PPC Advertising"
                                      id="checkbox_75eb5ba06cf654acf5af1f767f703f3a"
                                      aria-label="PPC Advertising"
                                      aria-invalid="false"
                                      aria-required="false"
                                    />{' '}
                                    <span>PPC Advertising</span>
                                  </label>
                                </div>
                                <div className="ff-el-form-check ff-el-form-check-">
                                  <label
                                    className="ff-el-form-check-label"
                                    htmlFor="checkbox_bf32e195992c7312d1a9edf4a3498836"
                                  >
                                    <input
                                      type="checkbox"
                                      name="checkbox[]"
                                      data-name="checkbox"
                                      className="ff-el-form-check-input ff-el-form-check-checkbox"
                                      defaultValue="SEO "
                                      id="checkbox_bf32e195992c7312d1a9edf4a3498836"
                                      aria-label="SEO"
                                      aria-invalid="false"
                                      aria-required="false"
                                    />{' '}
                                    <span>{'SEO '}</span>
                                  </label>
                                </div>
                                <div className="ff-el-form-check ff-el-form-check-">
                                  <label
                                    className="ff-el-form-check-label"
                                    htmlFor="checkbox_276535d7d849c27c80c3935b9ccbb36d"
                                  >
                                    <input
                                      type="checkbox"
                                      name="checkbox[]"
                                      data-name="checkbox"
                                      className="ff-el-form-check-input ff-el-form-check-checkbox"
                                      defaultValue="Web Design"
                                      id="checkbox_276535d7d849c27c80c3935b9ccbb36d"
                                      aria-label="Web Design"
                                      aria-invalid="false"
                                      aria-required="false"
                                    />{' '}
                                    <span>Web Design</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="ff-el-group ff-text-left ff_submit_btn_wrapper">
                              <button
                                type="submit"
                                className="ff-btn ff-btn-submit ff-btn-md nectar-stretch-button ff_btn_no_style"
                                aria-label="Schedule a Call"
                              >
                                Schedule a Call
                              </button>
                            </div>
                          </fieldset>
                        </form>
                        <div
                          id="fluentform_3_errors"
                          className="ff-errors-in-stack ff_form_instance_3_1 ff-form-loading_errors ff_form_instance_3_1_errors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="vc_col-sm-6 wpb_column column_container vc_column_container col no-extra-padding top_margin_tablet_40px inherit_tablet inherit_phone flex_layout_desktop_column flex_justify_content_desktop_flex-start flex_align_items_desktop_flex-start flex_wrap_desktop_nowrap flex_reverse_desktop_false flex_gap_desktop_5px "
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
                      id="fws_6adfaabea72ae"
                      data-midnight=""
                      data-column-margin="default"
                      className="wpb_row vc_row-fluid vc_row inner_row"
                    >
                      <div className="row-bg-wrap">
                        <div className="row-bg" />
                      </div>
                      <div className="row_col_wrap_12_inner col span_12  left">
                        <div
                          className="vc_col-sm-12 wpb_column column_container vc_column_container col child_column no-extra-padding inherit_tablet inherit_phone flex_layout_desktop_column flex_justify_content_desktop_flex-start flex_align_items_desktop_flex-start flex_wrap_desktop_nowrap flex_reverse_desktop_false flex_gap_desktop_5px "
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
                                <p>Say Hello</p>
                              </div>
                              <div
                                className="nectar-cta  alignment_tablet_default alignment_phone_default display_tablet_inherit display_phone_inherit font_size_desktop_2vw font_size_min_20px "
                                data-color="default"
                                data-using-bg="false"
                                data-style="text-reveal"
                                data-display="block"
                                data-alignment="left"
                                data-text-color="std"
                                style={
                                  {
                                    '--nectar-button-color': 'var(--nectar-default)',
                                    '--nectar-icon-gap': '10px',
                                  } as React.CSSProperties
                                }
                              >
                                <h3>
                                  <span className="link_wrap">
                                    <a className="link_text" role="button" href={emailHref}>
                                      <span
                                        className="text nectar-text-reveal-button__text"
                                        data-text={email}
                                      >
                                        {email}
                                      </span>
                                    </a>
                                  </span>
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="divider-wrap height_tablet_30px " data-alignment="default">
                      <div style={{ height: '50px' }} className="divider" />
                    </div>
                    <div
                      id="fws_6adfaabea780c"
                      data-midnight=""
                      data-column-margin="none"
                      className="wpb_row vc_row-fluid vc_row inner_row"
                    >
                      <div className="row-bg-wrap">
                        <div className="row-bg" />
                      </div>
                      <div className="row_col_wrap_12_inner col span_12  left">
                        <div
                          className="vc_col-sm-12 wpb_column column_container vc_column_container col child_column no-extra-padding inherit_tablet inherit_phone flex_gap_desktop_10px "
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
                                <p>Get Social</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      id="fws_6adfaabea7a6d"
                      data-midnight=""
                      data-column-margin="default"
                      className="wpb_row vc_row-fluid vc_row inner_row"
                    >
                      <div className="row-bg-wrap">
                        <div className="row-bg" />
                      </div>
                      <div className="row_col_wrap_12_inner col span_12  left">
                        <div
                          className="vc_col-sm-12 wpb_column column_container vc_column_container col child_column no-extra-padding inherit_tablet inherit_phone flex_layout_desktop_row flex_justify_content_desktop_flex-start flex_align_items_desktop_flex-start flex_wrap_desktop_nowrap flex_reverse_desktop_false flex_gap_desktop_20px "
                          data-padding-pos="all"
                          data-has-bg-color="false"
                          data-bg-color=""
                          data-bg-opacity="1"
                          data-animation=""
                          data-delay="0"
                        >
                          <div className="vc_column-inner">
                            <div className="wpb_wrapper">{socials}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            id="fws_6adfaabea7f87"
            data-column-margin="default"
            data-midnight="dark"
            data-color-change-section-bg-color="#FF9100"
            data-color-change-section-text-color="var(--nectar-font-color)"
            className="wpb_row vc_row-fluid vc_row full-width-content has-row-bg-color vc_row-o-equal-height vc_row-flex vc_row-o-content-top  right_padding_60px left_padding_60px nectar-overflow-hidden right_padding_tablet_25px left_padding_tablet_25px"
            style={
              {
                paddingTop: '0px',
                paddingBottom: '0px',
                '--row-bg-color': '#FF9100',
              } as React.CSSProperties
            }
          >
            <div
              className="row-bg-wrap"
              data-bg-animation="none"
              data-bg-animation-delay=""
              data-bg-overlay="false"
            >
              <div className="inner-wrap row-bg-layer">
                <div
                  className="row-bg viewport-desktop using-bg-color"
                  style={{ backgroundColor: '#FF9100' }}
                />
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
                      className="nectar-split-heading "
                      data-align="default"
                      data-m-align="inherit"
                      data-text-effect="none"
                      data-animation-type="line-reveal-by-space"
                      data-animation-delay="0"
                      data-animation-offset="100%"
                      data-m-rm-animation=""
                      data-stagger=""
                      data-custom-font-size="false"
                      data-has-fit-text="true"
                    >
                      <h1>{wordmark}</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="footer-outer"
        data-midnight="light"
        data-cols="4"
        data-custom-color="false"
        data-disable-copyright="true"
        data-matching-section-color="true"
        data-copyright-line="false"
        data-using-bg-img="false"
        data-bg-img-overlay="0.8"
        data-full-width="false"
        data-using-widget-area="false"
        data-link-hover="default"
      />
    </>
  )
}
