import React from 'react';
import ErrorForm from './ErrorForm';

class AppErrorBoundary extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { error: null, errorInfo: null };
  // }
  state = { hasError: false, error: null, errorInfo: null, status: null };
  // error = {}

  static getDerivedStateFromError(error) {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트 합니다.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('error.response', error?.response?.status);
    console.log('에러가 발생했습니다.');
    this.setState({ ...this.state, error, errorInfo, status: error?.response?.status });
    // You can also log error messages to an error reporting service here
    // if (ENV_MODE_PROD) axios.post(endPoint.post_error_meesage, errorData);
  }

  render() {
    // console.log(this.state.error, 'this.state.error');
    const { hasError, error, errorInfo } = this.state;
    console.log('hasError', hasError);
    console.log('error', error);
    console.log('errorInfo', errorInfo);
    if (hasError) {
      // Error path
      return (
        <>
          {process.env.NODE_ENV === 'development' ? (
            <div
              style={{ whiteSpace: 'pre-wrap', width: '1024px', padding: '8px', margin: '0 auto' }}
            >
              <p>{error}</p>
              <p>{errorInfo}</p>
              {/* <p>{errorInfo?.componentStack}</p> */}
            </div>
          ) : (
            <ErrorForm
              code="Error"
              infoText={
                'The server encountered an misconfiguration and was unable to complete your request.'
              }
              linkText={'Refresh'}
            />
          )}
        </>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default AppErrorBoundary;
