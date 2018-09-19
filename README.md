# TOT
修改node-modules 下

1,ac-qrcode/QRScanner.js
添加；import PropTypes from 'prop-types';

在QRScannerView 中 添加一下代码  
                      {/*绘制顶部标题栏组件  在遮罩上方*/}
                    {Platform.OS === "android" ? this.props.renderTopBarView() : null}

                    {/*绘制扫描遮罩*/}
                    <QRScannerRectView
                        maskColor={this.props.maskColor}
                        cornerColor={this.props.cornerColor}
                        borderColor={this.props.borderColor}
                        rectHeight={this.props.rectHeight}
                        rectWidth={this.props.rectWidth}
                        borderWidth={this.props.borderWidth}
                        cornerBorderWidth={this.props.cornerBorderWidth}
                        cornerBorderLength={this.props.cornerBorderLength}
                        isLoading={this.props.isLoading}
                        cornerOffsetSize={this.props.cornerOffsetSize}
                        isCornerOffset={this.props.isCornerOffset}
                        bottomMenuHeight={this.props.bottomMenuHeight}
                        scanBarAnimateTime={this.props.scanBarAnimateTime}
                        scanBarColor={this.props.scanBarColor}
                        scanBarHeight={this.props.scanBarHeight}
                        scanBarMargin={this.props.scanBarMargin}
                        hintText={this.props.hintText}
                        hintTextStyle={this.props.hintTextStyle}
                        scanBarImage={this.props.scanBarImage}
                        hintTextPosition={this.props.hintTextPosition}
                        isShowScanBar={this.props.isShowScanBar}
                    />
                    {/*绘制顶部标题栏组件 在遮罩下方*/}
                    {Platform.OS === "ios" ? this.props.renderTopBarView() : null}

2，修改 react-native-camera
添加；import PropTypes from 'prop-types';
