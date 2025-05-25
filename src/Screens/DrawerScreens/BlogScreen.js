import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from 'react-native';

export default function BlogScreen() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    fetch('http://10.0.2.2:7266/api/Blogs/GetAllBlogsWithAuthorList')
      .then((response) => response.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleReadMore = (blogID) => {
    const blog = blogs.find(b => b.blogID === blogID);
    setSelectedBlog(blog);
    setModalVisible(true);
    setComments([]);
    setCommentsLoading(true);
    fetch(`http://10.0.2.2:7266/api/Comments/CommentListByBlog?id=${blogID}`)
      .then((response) => response.json())
      .then((data) => {
        setComments(data);
        setCommentsLoading(false);
      })
      .catch(() => setCommentsLoading(false));
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedBlog(null);
    setComments([]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardInner}>
        <View style={styles.authorRow}>
          <Image source={{ uri: item.authorImageUrl }} style={styles.authorAvatar} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.authorName}>{item.authorName}</Text>
            <Text style={styles.authorDesc}>{item.authorDescription}</Text>
          </View>
        </View>
        <Text style={styles.metaDate}>{new Date(item.createdDate).toLocaleDateString('tr-TR')}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.description}</Text>
        <TouchableOpacity style={styles.readMoreBtn} onPress={() => handleReadMore(item.blogID)}>
          <Text style={styles.readMoreText}>Devamını Oku</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Yazarlarımızın Blogları</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00E676" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={blogs}
          renderItem={renderItem}
          keyExtractor={item => item.blogID.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedBlog && (
                <>
                  <Text style={styles.detailTitle}>{selectedBlog.title}</Text>
                  <Text style={styles.detailDesc}>{selectedBlog.description}</Text>
                  <View style={styles.tagsRow}>
                    {/* Etiketler burada gösterilebilir, ör: selectedBlog.tags.map(...) */}
                  </View>
                  <View style={styles.detailAuthorRow}>
                    <Image source={{ uri: selectedBlog.authorImageUrl }} style={styles.detailAuthorImage} />
                    <View style={{ marginLeft: 16 }}>
                      <Text style={styles.detailAuthorName}>{selectedBlog.authorName}</Text>
                      <Text style={styles.detailAuthorDesc}>{selectedBlog.authorDescription}</Text>
                    </View>
                  </View>
                  <Text style={styles.commentsTitle}>Yorumlar</Text>
                  {commentsLoading ? (
                    <ActivityIndicator size="small" color="#00E676" style={{ marginVertical: 10 }} />
                  ) : (
                    comments.length > 0 ? comments.map((c, idx) => (
                      <View key={idx} style={styles.commentRow}>
                        <Image source={{ uri: c.userImageUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(c.userName) }} style={styles.commentAvatar} />
                        <View style={{ marginLeft: 10, flex: 1 }}>
                          <Text style={styles.commentUser}>{c.userName}</Text>
                          <Text style={styles.commentDate}>{new Date(c.createdDate).toLocaleDateString('tr-TR')}</Text>
                          <Text style={styles.commentText}>{c.content}</Text>
                        </View>
                      </View>
                    )) : <Text style={styles.noCommentText}>Henüz yorum yok.</Text>
                  )}
                </>
              )}
              <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
                <Text style={styles.closeBtnText}>Kapat</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: 18,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 16,
    marginBottom: 18,
    marginTop: 8,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
    minHeight: 180,
  },
  cardInner: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eee',
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  authorDesc: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  metaDate: {
    fontSize: 13,
    color: '#00E676',
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 7,
    textAlign: 'center',
  },
  desc: {
    fontSize: 15,
    color: '#444',
    marginBottom: 18,
    textAlign: 'center',
  },
  readMoreBtn: {
    backgroundColor: '#00E676',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
    alignSelf: 'center',
  },
  readMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '96%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    maxHeight: '95%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  detailDesc: {
    fontSize: 16,
    color: '#444',
    marginBottom: 16,
    textAlign: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    justifyContent: 'center',
  },
  detailAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
    alignSelf: 'center',
  },
  detailAuthorImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
  },
  detailAuthorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  detailAuthorDesc: {
    fontSize: 15,
    color: '#888',
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    marginTop: 10,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 10,
  },
  commentAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#eee',
  },
  commentUser: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  commentDate: {
    fontSize: 12,
    color: '#00E676',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 15,
    color: '#444',
  },
  noCommentText: {
    fontSize: 15,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
  },
  closeBtn: {
    backgroundColor: '#00E676',
    borderRadius: 10,
    paddingVertical: 13,
    marginTop: 10,
    width: '100%',
    alignSelf: 'center',
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});